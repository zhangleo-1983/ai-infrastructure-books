"""Gracefully stop the reviewed Dify 1.17.1 teaching stack before cold backup.

Run from its docker directory: python3 stop-stack.py book06-dify
The isolated restore project is also accepted. Does not delete data or pull images.
"""
import json
from pathlib import Path
import subprocess
import sys
import time

PROJECTS = {"book06-dify", "book06-dify-restore"}
SERVICES = set("api api_websocket worker worker_beat web plugin_daemon agent_backend "
               "weaviate db_postgres redis nginx ssrf_proxy agent_ssrf_proxy sandbox "
               "local_sandbox init_permissions".split())
COMMANDS = {
    "nginx": ["nginx", "-s", "quit"],
    "ssrf_proxy": ["/usr/sbin/squid", "-k", "shutdown"],
    "agent_ssrf_proxy": ["/usr/sbin/squid", "-k", "shutdown"],
    "sandbox": ["/bin/bash", "-c", 'found=0; for p in /proc/[0-9]*/comm; do '
                'read -r name < "$p" || continue; if [ "$name" = main ]; then '
                'pid=${p%/comm}; kill -TERM "${pid##*/}"; found=1; fi; done; test "$found" = 1'],
}


def docker(*args):
    return subprocess.check_output(["docker", *args], text=True)


def validate(containers, project):
    names = [c["Config"].get("Labels", {}).get("com.docker.compose.service") for c in containers]
    if len(names) != 16 or set(names) != SERVICES or any(
            c["Config"].get("Labels", {}).get("com.docker.compose.project") != project
            for c in containers):
        raise ValueError("expected exactly the 16 containers of the selected project")
    for c in containers:
        service = c["Config"]["Labels"]["com.docker.compose.service"]
        if service in COMMANDS and c["HostConfig"]["RestartPolicy"]["Name"] != "always":
            raise ValueError("unexpected restart policy; inspect before changing it")
        if service != "init_permissions" and not c["State"]["Running"]:
            raise ValueError("restore the running baseline before this controlled stop")


def stop(project):
    if project not in PROJECTS or Path.cwd().resolve() != Path.home() / "docker-labs" / (
            "dify" if project == "book06-dify" else "dify-restore") / "docker":
        raise ValueError("wrong project or directory; inspect the selected teaching lab")
    ids = docker("ps", "-aq", "--filter", "label=com.docker.compose.project=" + project).split()
    containers = json.loads(docker("inspect", *ids)) if ids else []
    validate(containers, project)
    selected = {c["Config"]["Labels"]["com.docker.compose.service"]: c["Id"] for c in containers}
    # Disable automatic restart before asking the child processes to exit.
    # If anything fails, leave the maintenance window closed and inspect; do not archive.
    for service in COMMANDS:
        docker("update", "--restart=no", selected[service])
    for service, command in COMMANDS.items():
        docker("exec", selected[service], *command)
    for _ in range(40):
        targets = json.loads(docker("inspect", *[selected[s] for s in COMMANDS]))
        if all(not c["State"]["Running"] for c in targets):
            break
        time.sleep(2)
    else:
        raise ValueError("native shutdown did not complete; no forced termination or backup")
    if any(c["State"]["ExitCode"] not in {0, 143} for c in targets):
        raise ValueError("unexpected exit status; inspect before backup")
    files = ["docker-compose.yaml", "compose.book06.yaml"]
    if project == "book06-dify-restore":
        files += ["compose.images.yaml", "compose.restore.yaml"]
    docker("compose", "-p", project, *[arg for f in files for arg in ("-f", f)],
           "stop", "--timeout", "120")
    stopped = json.loads(docker("inspect", *ids))
    if any(c["State"]["Running"] or c["State"]["ExitCode"] not in {0, 143} for c in stopped):
        raise ValueError("project has not stopped cleanly; do not archive")
    for service in COMMANDS:
        docker("update", "--restart=always", selected[service])
    if any(c["State"]["Running"] for c in json.loads(docker("inspect", *ids))):
        raise ValueError("a container restarted; do not archive")
    print("OK: all 16 containers stopped without exit 137; original restart policies restored")


if __name__ == "__main__":
    try:
        if len(sys.argv) != 2:
            raise ValueError("usage: python3 stop-stack.py book06-dify|book06-dify-restore")
        stop(sys.argv[1])
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        raise SystemExit("STOP: " + str(error)) from None
