export const THEME_STORAGE_KEY = "ai-infrastructure-books:theme:v1";
export const READING_STATE_STORAGE_KEY =
  "ai-infrastructure-books:reading-state:v1";
export const READING_STATE_VERSION = 1;

export const THEME_MODES = ["system", "light", "dark"] as const;
export type ThemeMode = (typeof THEME_MODES)[number];

export const COPY_FEEDBACK_DURATION_MS = 1800;
export const SEARCH_DEBOUNCE_MS = 180;
export const SEARCH_RESULT_LIMIT = 8;
