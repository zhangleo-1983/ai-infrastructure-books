"""Read Compose JSON from stdin; print only a port/storage review summary."""
import json
import sys

config = json.load(sys.stdin)
services = config.get("services", {})
expected = {
    "api", "api_websocket", "worker", "worker_beat", "web", "plugin_daemon",
    "agent_backend", "weaviate", "db_postgres", "redis", "nginx", "ssrf_proxy",
    "agent_ssrf_proxy", "sandbox", "local_sandbox", "init_permissions",
}
if set(services) != expected:
    raise SystemExit("STOP: service set differs from the reviewed 1.17.1 default profiles")
ports = []
for name, service in services.items():
    if service.get("network_mode") == "host" or service.get("privileged"):
        raise SystemExit("STOP: unexpected host network or privileged service")
    for port in service.get("ports", []):
        ports.append((name, port.get("host_ip"), str(port.get("published")),
                      port.get("target"), port.get("protocol", "tcp")))
if ports != [("nginx", "127.0.0.1", "8088", 80, "tcp")]:
    raise SystemExit("STOP: effective published ports differ; do not start")
print("OK: 16 reviewed services; nginx 127.0.0.1:8088 -> 80/tcp only")
print("Persistent mounts to record locally (contains paths, not file contents):")
for name, service in sorted(services.items()):
    for mount in service.get("volumes", []):
        print(name, mount.get("type"), mount.get("source"), "->", mount.get("target"))
