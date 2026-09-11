"""Back up or restore the four reviewed Squid volumes, with all project services stopped.

Run with Docker access: python3 proxy-volumes.py backup|restore BACKUP_DIRECTORY
This supplements the two Agent archives; it does not back up the database or images.
"""
import json
import os
from pathlib import Path
import subprocess
import sys

PAIRS = {(service, target) for service in ("ssrf_proxy", "agent_ssrf_proxy")
         for target in ("/var/log/squid", "/var/spool/squid")}
SERVICES = set("api api_websocket worker worker_beat web plugin_daemon agent_backend "
               "weaviate db_postgres redis nginx ssrf_proxy agent_ssrf_proxy sandbox "
               "local_sandbox init_permissions".split())


def docker(*args):
    return subprocess.check_output(["docker", *args], text=True)


def inventory(containers, project):
    selected = [c for c in containers if
                c["Config"].get("Labels", {}).get("com.docker.compose.project") == project]
    names = [c["Config"]["Labels"].get("com.docker.compose.service") for c in selected]
    if len(names) != 16 or set(names) != SERVICES:
        raise ValueError("STOP: expected exactly the 16 project containers")
    if any(c["State"].get("Running") or c["State"].get("Restarting") for c in selected):
        raise ValueError("STOP: all project containers must be stopped")
    rows = []
    helper = None
    for c in selected:
        service = c["Config"]["Labels"]["com.docker.compose.service"]
        if service == "init_permissions":
            helper = c["Image"]
        for mount in c.get("Mounts", []):
            if service in {"ssrf_proxy", "agent_ssrf_proxy"} and mount["Type"] == "volume":
                target = mount["Destination"]
                if (service, target) not in PAIRS:
                    raise ValueError("STOP: unexpected proxy volume destination")
                rows.append({"service": service, "target": target, "volume": mount["Name"],
                             "archive": service + ("-log.tar" if target == "/var/log/squid" else "-spool.tar")})
    if len(rows) != 4 or {(r["service"], r["target"]) for r in rows} != PAIRS:
        raise ValueError("STOP: missing or duplicate proxy volume")
    volumes = {r["volume"] for r in rows}
    if len(volumes) != 4:
        raise ValueError("STOP: proxy volumes must be independent")
    for c in containers:
        if c not in selected and any(m.get("Name") in volumes for m in c.get("Mounts", [])):
            raise ValueError("STOP: proxy volume is shared with another container")
    return sorted(rows, key=lambda r: (r["service"], r["target"])), helper


def run(mode, folder):
    os.umask(0o077)
    folder = Path(folder).resolve(strict=True)
    if not folder.is_dir() or folder.stat().st_mode & 0o077:
        raise ValueError("STOP: backup directory must already exist and be private (700)")
    ids = docker("ps", "-aq").split()
    containers = json.loads(docker("inspect", *ids)) if ids else []
    project = "book06-dify" if mode == "backup" else "book06-dify-restore"
    rows, helper = inventory(containers, project)
    manifest = folder / "proxy-volumes.json"

    def helper_run(row, command, restore=False):
        docker("volume", "inspect", row["volume"])
        return docker("run", "--rm", "--pull", "never", "--network", "none", "--read-only",
                      "--user", "0:0", "--entrypoint", "/bin/sh",
                      "--mount", "type=volume,source=" + row["volume"] +
                      ",target=/data,volume-nocopy" + ("" if restore else ",readonly"),
                      "--mount", "type=bind,source=" + str(folder) + ",target=/backup" +
                      (",readonly" if restore else ""), helper, "-c", command)

    if mode == "backup":
        if manifest.exists() or any((folder / row["archive"]).exists() for row in rows):
            raise ValueError("STOP: backup files already exist; do not overwrite")
        for row in rows:
            helper_run(row, "tar -cpf /backup/" + row["archive"] + " -C /data .")
            (folder / row["archive"]).chmod(0o600)
        with manifest.open("x") as stream:
            json.dump(rows, stream, indent=2)
    else:
        source = json.loads(manifest.read_text())
        if len(source) != 4 or {(r["service"], r["target"], r["archive"]) for r in source} != {
                (r["service"], r["target"], r["archive"]) for r in rows}:
            raise ValueError("STOP: archive manifest does not match reviewed proxy mounts")
        if {r["volume"] for r in source} & {r["volume"] for r in rows}:
            raise ValueError("STOP: restore cannot reuse original volumes")
        for row in rows:
            archive = folder / row["archive"]
            if not archive.is_file() or archive.is_symlink():
                raise ValueError("STOP: archive is missing or is a symlink")
            helper_run(row, 'test -z "$(ls -A /data)"', restore=True)
        for row in rows:
            helper_run(row, 'test -z "$(ls -A /data)" && tar -xpf /backup/' +
                       row["archive"] + " -C /data", restore=True)
    print("OK: four distinct proxy volumes " + ("archived" if mode == "backup" else "restored"))


if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] not in {"backup", "restore"}:
        raise SystemExit("Usage: proxy-volumes.py backup|restore BACKUP_DIRECTORY")
    try:
        run(sys.argv[1], sys.argv[2])
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        raise SystemExit("STOP: " + str(error)) from None
