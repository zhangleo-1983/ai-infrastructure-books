"""Read effective Compose JSON without printing secrets. No Docker calls.

Run from the restored docker directory, before creating any containers.
This validates a teaching configuration, not runtime isolation or recovery.
"""
import json
from pathlib import Path
import re
import sys


def validate(config, root):
    root = Path(root).resolve()
    if root.name != "docker" or root.parent.name != "dify-restore":
        raise ValueError("STOP: run only from the separate dify-restore/docker directory")
    project = "book06-dify-restore"
    expected = {
        "api", "api_websocket", "worker", "worker_beat", "web", "plugin_daemon",
        "agent_backend", "weaviate", "db_postgres", "redis", "nginx", "ssrf_proxy",
        "agent_ssrf_proxy", "sandbox", "local_sandbox", "init_permissions",
    }
    services = config.get("services", {})
    if config.get("name") != project or set(services) != expected:
        raise ValueError("STOP: wrong restore project or service set")
    networks = config.get("networks", {})
    if not networks or any(not n.get("internal") or n.get("external") or
                           n.get("name") != project + "_" + key
                           for key, n in networks.items()):
        raise ValueError("STOP: restore networks must be internal and separate")
    volumes = config.get("volumes", {})
    expected_volumes = {"dify_agent_local_sandbox_home", "dify_agent_local_sandbox_workspace"}
    if set(volumes) != expected_volumes or any(v.get("external") or
            v.get("name") != project + "_" + key for key, v in volumes.items()):
        raise ValueError("STOP: unexpected or shared named volume")
    public_urls = {"CONSOLE_API_URL", "CONSOLE_WEB_URL", "SERVICE_API_URL",
                   "APP_API_URL", "APP_WEB_URL", "FILES_URL",
                   "WEB_API_CORS_ALLOW_ORIGINS", "CONSOLE_CORS_ALLOW_ORIGINS"}
    ports = []
    proxy_mounts = set()
    for name, service in services.items():
        if any(service.get(k) for k in ("network_mode", "privileged", "container_name",
                                       "external_links", "extra_hosts", "devices")):
            raise ValueError("STOP: unexpected shared host capability")
        if not re.fullmatch(r"sha256:[0-9a-f]{64}", service.get("image", "")):
            raise ValueError("STOP: every restore image must use the recorded local image ID")
        if not service.get("networks") or set(service["networks"]) - set(networks):
            raise ValueError("STOP: service has an unreviewed network")
        for key, value in service.get("environment", {}).items():
            if key in public_urls and value != "http://localhost:8089":
                raise ValueError("STOP: browser URL or origin is not the restore endpoint")
            if key == "NEXT_PUBLIC_SOCKET_URL" and value != "ws://localhost:8089":
                raise ValueError("STOP: wrong restore socket URL")
        for mount in service.get("volumes", []):
            source = mount.get("source", "")
            if mount.get("type") == "bind":
                if not source or not Path(source).resolve().is_relative_to(root):
                    raise ValueError("STOP: bind mount points outside the restore directory")
            elif mount.get("type") == "volume":
                if not source and name in {"ssrf_proxy", "agent_ssrf_proxy"} and mount.get("target") in {
                    "/var/log/squid", "/var/spool/squid"
                } and mount.get("volume", {}).get("nocopy"):
                    pair = (name, mount["target"])
                    if pair in proxy_mounts:
                        raise ValueError("STOP: duplicate proxy volume")
                    proxy_mounts.add(pair)
                elif source not in expected_volumes or not mount.get("volume", {}).get("nocopy"):
                    raise ValueError("STOP: unreviewed or auto-populating named volume")
            else:
                raise ValueError("STOP: unreviewed mount type")
        for port in service.get("ports", []):
            ports.append((name, port.get("host_ip"), str(port.get("published")),
                          port.get("target"), port.get("protocol", "tcp")))
    if proxy_mounts != {(name, target) for name in {"ssrf_proxy", "agent_ssrf_proxy"}
                        for target in {"/var/log/squid", "/var/spool/squid"}}:
        raise ValueError("STOP: four separate nocopy proxy volumes are required")
    if ports != [("nginx", "127.0.0.1", "8089", 80, "tcp")]:
        raise ValueError("STOP: unexpected restore published ports")
    return "OK: separate restore storage; recorded images; internal networks; loopback 8089 only"


if __name__ == "__main__":
    try:
        print(validate(json.load(sys.stdin), Path.cwd()))
    except (OSError, ValueError) as error:
        raise SystemExit(str(error)) from None
