import {
  THEME_MODES,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from "./constants";

export function isThemeMode(value: unknown): value is ThemeMode {
  return (
    typeof value === "string" &&
    THEME_MODES.includes(value as ThemeMode)
  );
}

export function resolveTheme(
  mode: ThemeMode,
  systemPrefersDark: boolean,
): "light" | "dark" {
  if (mode === "system") return systemPrefersDark ? "dark" : "light";
  return mode;
}

function readThemeMode(storage: Storage): ThemeMode {
  try {
    const stored = storage.getItem(THEME_STORAGE_KEY);
    return isThemeMode(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function saveThemeMode(storage: Storage, mode: ThemeMode): void {
  try {
    storage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // The selected theme still applies for this page when storage is blocked.
  }
}

function applyTheme(
  mode: ThemeMode,
  systemPreference: MediaQueryList,
): void {
  const resolved = resolveTheme(mode, systemPreference.matches);
  const root = document.documentElement;
  root.dataset.themeMode = mode;

  if (mode === "system") {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = mode;
  }

  const themeColor = document.querySelector<HTMLMetaElement>(
    "meta[data-theme-color]",
  );
  if (themeColor) {
    themeColor.content = resolved === "dark" ? "#0c121a" : "#f3f6fa";
  }
}

export function initializeTheme(): void {
  const select = document.querySelector<HTMLSelectElement>(
    "[data-theme-select]",
  );
  const control = document.querySelector<HTMLElement>("[data-theme-control]");
  if (!select || !control) return;

  const selectElement = select;
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
  let mode = readThemeMode(window.localStorage);

  function update(nextMode: ThemeMode, persist = false): void {
    mode = nextMode;
    selectElement.value = nextMode;
    applyTheme(nextMode, systemPreference);
    if (persist) saveThemeMode(window.localStorage, nextMode);
  }

  control.hidden = false;
  update(mode);

  selectElement.addEventListener("change", () => {
    const selected = selectElement.value;
    if (isThemeMode(selected)) update(selected, true);
  });

  systemPreference.addEventListener("change", () => {
    if (mode === "system") applyTheme(mode, systemPreference);
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    update(isThemeMode(event.newValue) ? event.newValue : "system");
  });
}

if (typeof document !== "undefined") initializeTheme();
