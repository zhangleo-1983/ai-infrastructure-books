"""Prepare a NEW Dify 1.17.1 lab .env without printing credentials.

Run in the official docker directory. This does not start Docker or call models.
Existing .env or runtime data are refused; unchanged bundled config is allowed.
"""
from pathlib import Path
import hashlib
import os
import re
import secrets

# SHA-256 of the five bundled files in official 1.17.1 (8387590ace4a).
# A fresh clone already has volumes/: never remove it to pass this check.
BUNDLED_CONFIG = {
    "myscale/config/users.d/custom_users_config.xml": "663aa8f0f1692c8ddc8a3943a2cd028b0671534c47ca7412dfdfc8ca29d1648a",
    "oceanbase/init.d/vec_memory.sql": "eb7d448b4f262c86800f506926ef08c5346c13ea0bf7232c92bd39f0ac8e215f",
    "opensearch/opensearch_dashboards.yml": "3ae2297c7afc80d2142c6348499e81991c6897bdfa058ebc39fe81115bb66e76",
    "sandbox/conf/config.yaml": "53c3903d679d68a3c0e1bc0eb8344dac12d49592059aa39d12773b6d2c8118f6",
    "sandbox/conf/config.yaml.example": "9802be19d971b55c011059b1182f375f198d9d6697991d21493c3559041cec51",
}


def pristine_bundled_config(volumes):
    if volumes.is_symlink() or not volumes.is_dir():
        return False
    expected_dirs = {str(parent) for name in BUNDLED_CONFIG
                     for parent in Path(name).parents if str(parent) != "."}
    files = set()
    for path in volumes.rglob("*"):
        name = path.relative_to(volumes).as_posix()
        if path.is_symlink():
            return False
        if path.is_dir():
            if name not in expected_dirs:
                return False
        elif path.is_file() and name in BUNDLED_CONFIG:
            if hashlib.sha256(path.read_bytes()).hexdigest() != BUNDLED_CONFIG[name]:
                return False
            files.add(name)
        else:
            return False
    return files == set(BUNDLED_CONFIG)


def prepare(directory):
    directory = Path(directory)
    target = directory / ".env"
    volumes = directory / "volumes"
    if target.exists() or target.is_symlink():
        raise ValueError("STOP: existing .env; do not regenerate secrets")
    if (volumes.exists() or volumes.is_symlink()) and not pristine_bundled_config(volumes):
        raise ValueError("STOP: volumes contains data or changed bundled config; do not regenerate secrets")
    source = (directory / ".env.example").read_text(encoding="utf-8")
    # Shared passwords/keys must match at both ends of each connection.
    redis_password = secrets.token_hex(32)
    vector_key = secrets.token_hex(32)
    sandbox_key = secrets.token_hex(32)
    replacements = {
        "SECRET_KEY": secrets.token_hex(32),
        "DB_PASSWORD": secrets.token_hex(32),
        "REDIS_PASSWORD": redis_password,
        "CELERY_BROKER_URL": f"redis://:{redis_password}@redis:6379/1",
        "WEAVIATE_API_KEY": vector_key,
        "WEAVIATE_AUTHENTICATION_APIKEY_ALLOWED_KEYS": vector_key,
        "WEAVIATE_AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED": "false",
        "SANDBOX_API_KEY": sandbox_key,
        "CODE_EXECUTION_API_KEY": sandbox_key,
        "PLUGIN_DAEMON_KEY": secrets.token_hex(32),
        "PLUGIN_DIFY_INNER_API_KEY": secrets.token_hex(32),
        "DIFY_AGENT_API_TOKEN": secrets.token_urlsafe(32),
        "DIFY_AGENT_SERVER_SECRET_KEY": secrets.token_urlsafe(32),
        "DIFY_AGENT_LOCAL_SANDBOX_AUTH_TOKEN": secrets.token_hex(32),
        "COMPOSE_PROFILES": "weaviate,postgresql,collaboration",
        "CONSOLE_API_URL": "http://localhost:8088",
        "CONSOLE_WEB_URL": "http://localhost:8088",
        "SERVICE_API_URL": "http://localhost:8088",
        "APP_API_URL": "http://localhost:8088",
        "APP_WEB_URL": "http://localhost:8088",
        "FILES_URL": "http://localhost:8088",
        "SERVER_CONSOLE_API_URL": "http://api:5001",
        "INTERNAL_FILES_URL": "http://api:5001",
        "NEXT_PUBLIC_SOCKET_URL": "ws://localhost:8088",
        "WEB_API_CORS_ALLOW_ORIGINS": "http://localhost:8088",
        "CONSOLE_CORS_ALLOW_ORIGINS": "http://localhost:8088",
        "FORCE_VERIFYING_SIGNATURE": "true",
        "PLUGIN_PPROF_ENABLED": "false",
    }
    for key, value in replacements.items():
        pattern = re.compile(r"^" + re.escape(key) + r"=.*$", re.MULTILINE)
        if len(pattern.findall(source)) != 1:
            raise ValueError(f"STOP: expected exactly one {key} in this version's template")
        source = pattern.sub(lambda match: key + "=" + value, source)
    # Validate before creating the file; refuse an existing file atomically.
    fd = os.open(target, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    with os.fdopen(fd, "w", encoding="utf-8") as stream:
        stream.write(source)
    print("OK: created .env with mode 600; no secret values printed")


if __name__ == "__main__":
    try:
        prepare(Path.cwd())
    except (OSError, ValueError) as error:
        raise SystemExit(str(error)) from None
