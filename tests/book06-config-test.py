"""Offline regression checks for the executable book06 teaching helpers.

No Docker daemon, network, real credentials or model requests are used.
Run: python3 tests/book06-config-test.py
"""
import contextlib
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import stat
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch

ASSETS = Path(__file__).resolve().parents[1] / "src/content/book-assets/06-dify"
spec = importlib.util.spec_from_file_location("prepare_env", ASSETS / "prepare-env.py")
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
restore_spec = importlib.util.spec_from_file_location("restore_config", ASSETS / "check-restore-config.py")
restore_helper = importlib.util.module_from_spec(restore_spec)
restore_spec.loader.exec_module(restore_helper)
proxy_spec = importlib.util.spec_from_file_location("proxy_volumes", ASSETS / "proxy-volumes.py")
proxy_helper = importlib.util.module_from_spec(proxy_spec)
proxy_spec.loader.exec_module(proxy_helper)
stop_spec = importlib.util.spec_from_file_location("stop_stack", ASSETS / "stop-stack.py")
stop_helper = importlib.util.module_from_spec(stop_spec)
stop_spec.loader.exec_module(stop_helper)

KEYS = """SECRET_KEY DB_PASSWORD REDIS_PASSWORD CELERY_BROKER_URL WEAVIATE_API_KEY
WEAVIATE_AUTHENTICATION_APIKEY_ALLOWED_KEYS WEAVIATE_AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED
SANDBOX_API_KEY CODE_EXECUTION_API_KEY PLUGIN_DAEMON_KEY PLUGIN_DIFY_INNER_API_KEY
DIFY_AGENT_API_TOKEN DIFY_AGENT_SERVER_SECRET_KEY DIFY_AGENT_LOCAL_SANDBOX_AUTH_TOKEN
COMPOSE_PROFILES CONSOLE_API_URL CONSOLE_WEB_URL SERVICE_API_URL APP_API_URL APP_WEB_URL
FILES_URL SERVER_CONSOLE_API_URL INTERNAL_FILES_URL NEXT_PUBLIC_SOCKET_URL
WEB_API_CORS_ALLOW_ORIGINS CONSOLE_CORS_ALLOW_ORIGINS FORCE_VERIFYING_SIGNATURE
PLUGIN_PPROF_ENABLED""".split()
SERVICES = """api api_websocket worker worker_beat web plugin_daemon agent_backend
weaviate db_postgres redis nginx ssrf_proxy agent_ssrf_proxy sandbox local_sandbox
init_permissions""".split()


class EnvTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.example = self.root / ".env.example"
        self.example.write_text("# fixture only\nUNCHANGED=preserved\n" +
                                "".join(key + "=\n" for key in KEYS), encoding="utf-8")

    def test_paired_secrets_permissions_and_no_disclosure(self):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            helper.prepare(self.root)
        target = self.root / ".env"
        values = dict(line.split("=", 1) for line in target.read_text().splitlines()
                      if line and not line.startswith("#"))
        self.assertEqual(stat.S_IMODE(target.stat().st_mode), 0o600)
        self.assertEqual(values["UNCHANGED"], "preserved")
        self.assertEqual(values["CELERY_BROKER_URL"],
                         "redis://:" + values["REDIS_PASSWORD"] + "@redis:6379/1")
        self.assertEqual(values["WEAVIATE_API_KEY"], values["WEAVIATE_AUTHENTICATION_APIKEY_ALLOWED_KEYS"])
        self.assertEqual(values["SANDBOX_API_KEY"], values["CODE_EXECUTION_API_KEY"])
        for key in ["SECRET_KEY", "DB_PASSWORD", "REDIS_PASSWORD", "WEAVIATE_API_KEY",
                    "SANDBOX_API_KEY", "PLUGIN_DAEMON_KEY", "PLUGIN_DIFY_INNER_API_KEY",
                    "DIFY_AGENT_API_TOKEN", "DIFY_AGENT_SERVER_SECRET_KEY",
                    "DIFY_AGENT_LOCAL_SANDBOX_AUTH_TOKEN"]:
            self.assertGreaterEqual(len(values[key]), 43)
            self.assertNotIn(values[key], output.getvalue())
        self.assertEqual(values["COMPOSE_PROFILES"], "weaviate,postgresql,collaboration")
        self.assertEqual(values["WEAVIATE_AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED"], "false")
        self.assertEqual(values["CONSOLE_CORS_ALLOW_ORIGINS"], "http://localhost:8088")
        self.assertEqual(values["INTERNAL_FILES_URL"], "http://api:5001")

    def test_existing_env_is_preserved(self):
        target = self.root / ".env"
        target.write_text("existing-data")
        with self.assertRaises(ValueError):
            helper.prepare(self.root)
        self.assertEqual(target.read_text(), "existing-data")

    def test_existing_data_directory_is_refused(self):
        (self.root / "volumes").mkdir()
        with self.assertRaises(ValueError):
            helper.prepare(self.root)
        self.assertFalse((self.root / ".env").exists())

    def test_bundled_config_allowed_but_runtime_or_changed_files_refused(self):
        volumes = self.root / "volumes"
        bundled = volumes / "sandbox/conf/config.yaml"
        bundled.parent.mkdir(parents=True)
        bundled.write_bytes(b"bundled fixture")
        manifest = {"sandbox/conf/config.yaml": hashlib.sha256(b"bundled fixture").hexdigest()}
        with patch.object(helper, "BUNDLED_CONFIG", manifest):
            self.assertTrue(helper.pristine_bundled_config(volumes))
            with contextlib.redirect_stdout(io.StringIO()):
                helper.prepare(self.root)
            (self.root / ".env").unlink()
            for extra in [volumes / "app", volumes / "sandbox/conf/runtime"]:
                extra.mkdir()
                with self.assertRaises(ValueError):
                    helper.prepare(self.root)
                extra.rmdir()
            bundled.write_bytes(b"changed fixture")
            with self.assertRaises(ValueError):
                helper.prepare(self.root)
            bundled.unlink()
            bundled.symlink_to(self.example)
            with self.assertRaises(ValueError):
                helper.prepare(self.root)
            bundled.unlink()
            with self.assertRaises(ValueError):
                helper.prepare(self.root)
            self.assertFalse((self.root / ".env").exists())

    def test_dangling_env_symlink_is_refused(self):
        (self.root / ".env").symlink_to(self.root / "absent")
        with self.assertRaises(ValueError):
            helper.prepare(self.root)
        self.assertFalse((self.root / "absent").exists())

    def test_dangling_data_symlink_is_refused(self):
        (self.root / "volumes").symlink_to(self.root / "absent")
        with self.assertRaises(ValueError):
            helper.prepare(self.root)
        self.assertFalse((self.root / ".env").exists())

    def test_template_missing_or_duplicate_key_never_writes_partial_env(self):
        original = self.example.read_text()
        for changed in [original.replace("PLUGIN_PPROF_ENABLED=\n", ""),
                        original + "PLUGIN_PPROF_ENABLED=\n"]:
            with self.subTest(template=changed[-40:]):
                self.example.write_text(changed)
                with self.assertRaises(ValueError):
                    helper.prepare(self.root)
                self.assertFalse((self.root / ".env").exists())


class ConfigTests(unittest.TestCase):
    def setUp(self):
        self.config = {"services": {name: {} for name in SERVICES}}
        self.config["services"]["nginx"]["ports"] = [
            {"host_ip": "127.0.0.1", "published": "8088", "target": 80, "protocol": "tcp"}]
        self.config["services"]["api"]["environment"] = {"SECRET_KEY": "synthetic-do-not-print"}

    def run_check(self):
        return subprocess.run([sys.executable, str(ASSETS / "check-config.py")],
                              input=json.dumps(self.config), text=True, capture_output=True)

    def test_only_loopback_nginx_passes_without_printing_environment(self):
        result = self.run_check()
        self.assertEqual(result.returncode, 0)
        self.assertIn("127.0.0.1:8088", result.stdout)
        self.assertNotIn("synthetic-do-not-print", result.stdout + result.stderr)

    def test_public_binding_is_rejected(self):
        self.config["services"]["nginx"]["ports"][0]["host_ip"] = "0.0.0.0"
        self.assertNotEqual(self.run_check().returncode, 0)

    def test_extra_debug_port_is_rejected(self):
        self.config["services"]["plugin_daemon"]["ports"] = [{"published": "5003", "target": 5003}]
        self.assertNotEqual(self.run_check().returncode, 0)

    def test_unexpected_service_is_rejected(self):
        self.config["services"]["extra"] = {}
        self.assertNotEqual(self.run_check().returncode, 0)

    def test_host_network_and_privileged_are_rejected(self):
        for key, value in [("network_mode", "host"), ("privileged", True)]:
            with self.subTest(option=key):
                self.config["services"]["api"][key] = value
                self.assertNotEqual(self.run_check().returncode, 0)
                del self.config["services"]["api"][key]


class RestoreConfigTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name) / "dify-restore" / "docker"
        self.root.mkdir(parents=True)
        project = "book06-dify-restore"
        volumes = ["dify_agent_local_sandbox_home", "dify_agent_local_sandbox_workspace"]
        self.config = {
            "name": project,
            "services": {name: {"image": "sha256:" + "0" * 64,
                                "networks": {"default": None}} for name in SERVICES},
            "networks": {"default": {"name": project + "_default", "internal": True}},
            "volumes": {v: {"name": project + "_" + v} for v in volumes},
        }
        self.config["services"]["nginx"]["ports"] = [
            {"host_ip": "127.0.0.1", "published": "8089", "target": 80}]
        self.config["services"]["api"]["volumes"] = [
            {"type": "bind", "source": str(self.root / "volumes/app/storage"), "target": "/storage"}]
        self.config["services"]["local_sandbox"]["volumes"] = [
            {"type": "volume", "source": v, "volume": {"nocopy": True}} for v in volumes]
        for service in ("ssrf_proxy", "agent_ssrf_proxy"):
            self.config["services"][service]["volumes"] = [
                {"type": "volume", "target": target, "volume": {"nocopy": True}}
                for target in ("/var/log/squid", "/var/spool/squid")]

    def reject(self):
        with self.assertRaises(ValueError):
            restore_helper.validate(self.config, self.root)

    def test_isolated_configuration_passes(self):
        self.assertIn("loopback 8089", restore_helper.validate(self.config, self.root))

    def test_missing_or_auto_populating_proxy_volume_is_rejected(self):
        mounts = self.config["services"]["ssrf_proxy"]["volumes"]
        mount = mounts.pop()
        self.reject()
        mounts.append(mount)
        mount["volume"]["nocopy"] = False
        self.reject()

    def test_original_project_is_rejected(self):
        self.config["name"] = "book06-dify"
        self.reject()

    def test_source_directory_is_rejected_even_with_restore_project_name(self):
        with self.assertRaises(ValueError):
            restore_helper.validate(self.config, self.root.parent.parent / "dify" / "docker")

    def test_external_network_and_undeclared_network_are_rejected(self):
        self.config["networks"]["default"]["internal"] = False
        self.reject()
        self.config["networks"]["default"]["internal"] = True
        self.config["services"]["api"]["networks"]["unreviewed"] = None
        self.reject()

    def test_shared_named_volume_is_rejected(self):
        v = "dify_agent_local_sandbox_home"
        self.config["volumes"][v]["name"] = "book06-dify_" + v
        self.reject()

    def test_original_directory_or_symlink_is_rejected(self):
        mount = self.config["services"]["api"]["volumes"][0]
        mount["source"] = str(self.root.parent / "source")
        self.reject()
        (self.root / "outside").symlink_to(self.root.parent)
        mount["source"] = str(self.root / "outside/source")
        self.reject()

    def test_floating_image_is_rejected(self):
        self.config["services"]["api"]["image"] = "langgenius/dify-api:latest"
        self.reject()

    def test_public_port_and_original_origin_are_rejected(self):
        self.config["services"]["nginx"]["ports"][0]["host_ip"] = "0.0.0.0"
        self.reject()
        self.config["services"]["nginx"]["ports"][0]["host_ip"] = "127.0.0.1"
        self.config["services"]["api"]["environment"] = {"CONSOLE_API_URL": "http://localhost:8088"}
        self.reject()

    def test_auto_populating_volume_and_host_gateway_are_rejected(self):
        mount = self.config["services"]["local_sandbox"]["volumes"][0]
        mount["volume"]["nocopy"] = False
        self.reject()
        mount["volume"]["nocopy"] = True
        self.config["services"]["api"]["extra_hosts"] = {"gateway": "host-gateway"}
        self.reject()


class ProxyInventoryTests(unittest.TestCase):
    def setUp(self):
        self.containers = [{"Config": {"Labels": {"com.docker.compose.project": "book06-dify",
                             "com.docker.compose.service": name}}, "Image": "sha256:" + "0" * 64,
                             "State": {"Running": False}, "Mounts": []} for name in SERVICES]
        for c in self.containers:
            name = c["Config"]["Labels"]["com.docker.compose.service"]
            if name in ("ssrf_proxy", "agent_ssrf_proxy"):
                c["Mounts"] = [{"Type": "volume", "Destination": target, "Name": name + str(i)}
                               for i, target in enumerate(("/var/log/squid", "/var/spool/squid"))]

    def test_anonymous_volumes_are_included_without_printing_environment(self):
        rows, image = proxy_helper.inventory(self.containers, "book06-dify")
        self.assertEqual(len(rows), 4)
        self.assertEqual(len({r["archive"] for r in rows}), 4)

    def test_running_or_missing_container_is_rejected(self):
        self.containers[0]["State"]["Running"] = True
        with self.assertRaises(ValueError):
            proxy_helper.inventory(self.containers, "book06-dify")
        self.containers.pop(0)
        with self.assertRaises(ValueError):
            proxy_helper.inventory(self.containers, "book06-dify")

    def test_missing_or_shared_proxy_volume_is_rejected(self):
        proxy = next(c for c in self.containers if c["Mounts"])
        mount = proxy["Mounts"].pop()
        with self.assertRaises(ValueError):
            proxy_helper.inventory(self.containers, "book06-dify")
        proxy["Mounts"].append(mount)
        self.containers.append({"Config": {"Labels": {}}, "Mounts": [mount]})
        with self.assertRaises(ValueError):
            proxy_helper.inventory(self.containers, "book06-dify")


class StopStackTests(unittest.TestCase):
    def setUp(self):
        self.containers = [{"Config": {"Labels": {"com.docker.compose.project": "book06-dify",
                            "com.docker.compose.service": name}},
                            "HostConfig": {"RestartPolicy": {"Name": "always"}},
                            "State": {"Running": name != "init_permissions"}} for name in SERVICES]

    def test_full_running_project_accepts_completed_init(self):
        stop_helper.validate(self.containers, "book06-dify")

    def test_foreign_or_duplicate_container_is_rejected(self):
        self.containers[0]["Config"]["Labels"]["com.docker.compose.project"] = "other"
        with self.assertRaises(ValueError):
            stop_helper.validate(self.containers, "book06-dify")
        self.containers[0] = self.containers[1]
        with self.assertRaises(ValueError):
            stop_helper.validate(self.containers, "book06-dify")

    def test_changed_policy_or_partial_start_is_rejected(self):
        target = next(c for c in self.containers if
                      c["Config"]["Labels"]["com.docker.compose.service"] == "nginx")
        target["HostConfig"]["RestartPolicy"]["Name"] = "unless-stopped"
        with self.assertRaises(ValueError):
            stop_helper.validate(self.containers, "book06-dify")
        target["HostConfig"]["RestartPolicy"]["Name"] = "always"
        target["State"]["Running"] = False
        with self.assertRaises(ValueError):
            stop_helper.validate(self.containers, "book06-dify")


if __name__ == "__main__":
    unittest.main()
