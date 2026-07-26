import {
  READING_STATE_STORAGE_KEY,
  READING_STATE_VERSION,
} from "./constants";

export interface BookReadingState {
  completed: string[];
}

export interface ReadingState {
  version: number;
  books: Record<string, BookReadingState>;
}

export interface CompletionSummary {
  completed: number;
  total: number;
  complete: boolean;
}

export function createEmptyReadingState(): ReadingState {
  return {
    version: READING_STATE_VERSION,
    books: {},
  };
}

export function parseReadingState(raw: string | null): ReadingState {
  if (!raw) return createEmptyReadingState();

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      parsed.version !== READING_STATE_VERSION ||
      !("books" in parsed) ||
      typeof parsed.books !== "object" ||
      parsed.books === null
    ) {
      return createEmptyReadingState();
    }

    const books: Record<string, BookReadingState> = {};
    for (const [book, value] of Object.entries(parsed.books)) {
      if (
        typeof value === "object" &&
        value !== null &&
        "completed" in value &&
        Array.isArray(value.completed)
      ) {
        const completedValues: unknown[] = value.completed;
        books[book] = {
          completed: [
            ...new Set(
              completedValues.filter(
                (slug: unknown): slug is string => typeof slug === "string",
              ),
            ),
          ],
        };
      }
    }

    return {
      version: READING_STATE_VERSION,
      books,
    };
  } catch {
    return createEmptyReadingState();
  }
}

export function setChapterCompleted(
  state: ReadingState,
  book: string,
  slug: string,
  completed: boolean,
): ReadingState {
  const current = new Set(state.books[book]?.completed ?? []);
  if (completed) current.add(slug);
  else current.delete(slug);

  return {
    version: READING_STATE_VERSION,
    books: {
      ...state.books,
      [book]: { completed: [...current] },
    },
  };
}

export function getCompletionSummary(
  state: ReadingState,
  book: string,
  eligibleSlugs: readonly string[],
): CompletionSummary {
  const completed = new Set(state.books[book]?.completed ?? []);
  const completedCount = eligibleSlugs.filter((slug) =>
    completed.has(slug),
  ).length;

  return {
    completed: completedCount,
    total: eligibleSlugs.length,
    complete:
      eligibleSlugs.length > 0 && completedCount === eligibleSlugs.length,
  };
}

function readState(storage: Storage): ReadingState {
  try {
    return parseReadingState(storage.getItem(READING_STATE_STORAGE_KEY));
  } catch {
    return createEmptyReadingState();
  }
}

function writeState(storage: Storage, state: ReadingState): void {
  try {
    storage.setItem(READING_STATE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The in-memory state remains usable when storage is unavailable.
  }
}

function updateTableOfContents(
  tableOfContents: HTMLElement,
  state: ReadingState,
): void {
  const book = tableOfContents.dataset.bookId;
  if (!book) return;

  const eligibleItems = Array.from(
    tableOfContents.querySelectorAll<HTMLElement>(
      "[data-toc-item][data-completion-eligible='true']",
    ),
  );
  const eligibleSlugs = eligibleItems
    .map((item) => item.dataset.chapterSlug)
    .filter((slug): slug is string => Boolean(slug));
  const completed = new Set(state.books[book]?.completed ?? []);

  for (const item of eligibleItems) {
    const slug = item.dataset.chapterSlug;
    if (!slug) continue;
    const isComplete = completed.has(slug);
    item.dataset.completed = String(isComplete);

    const indicator = item.querySelector<HTMLElement>(
      "[data-toc-completion-indicator]",
    );
    if (indicator) indicator.hidden = !isComplete;

    const link = item.querySelector<HTMLAnchorElement>(
      ".table-of-contents__item a",
    );
    if (link) {
      const baseLabel = link.dataset.baseLabel ?? link.textContent?.trim() ?? "";
      link.dataset.baseLabel = baseLabel;
      if (isComplete) link.setAttribute("aria-label", `${baseLabel}，已完成`);
      else link.removeAttribute("aria-label");
    }
  }

  const summary = getCompletionSummary(state, book, eligibleSlugs);
  const summaryElement = tableOfContents.querySelector<HTMLElement>(
    "[data-book-completion-summary]",
  );
  if (summaryElement) {
    summaryElement.textContent = summary.complete
      ? `${summary.completed} / ${summary.total} 章完成 · 本册完成`
      : `${summary.completed} / ${summary.total} 章完成`;
  }
  tableOfContents.dataset.bookComplete = String(summary.complete);
}

function updateCurrentChapter(state: ReadingState): void {
  const root = document.querySelector<HTMLElement>(
    "[data-chapter-status-root]",
  );
  if (!root) return;

  const book = root.dataset.bookId;
  const slug = root.dataset.chapterSlug;
  const eligible = root.dataset.completionEligible === "true";
  if (!book || !slug || !eligible) return;

  const completed = new Set(state.books[book]?.completed ?? []);
  const isComplete = completed.has(slug);
  const control = root.querySelector<HTMLInputElement>(
    "[data-chapter-complete-control]",
  );
  const checklist = root.querySelector<HTMLElement>(
    "[data-chapter-checklist]",
  );
  const message = root.querySelector<HTMLElement>(
    "[data-chapter-status-message]",
  );

  if (control) control.checked = isComplete;
  if (checklist) checklist.dataset.completed = String(isComplete);
  if (message) {
    message.textContent = isComplete
      ? "本章已完成，状态已保存在本机。"
      : "尚未标记完成。";
  }
}

export function initializeChapterStatus(): void {
  let state = readState(window.localStorage);
  const tableOfContents = Array.from(
    document.querySelectorAll<HTMLElement>("[data-table-of-contents]"),
  );
  const root = document.querySelector<HTMLElement>(
    "[data-chapter-status-root]",
  );
  const control = root?.querySelector<HTMLInputElement>(
    "[data-chapter-complete-control]",
  );

  function render(): void {
    for (const table of tableOfContents) updateTableOfContents(table, state);
    updateCurrentChapter(state);
  }

  control?.addEventListener("change", () => {
    const book = root?.dataset.bookId;
    const slug = root?.dataset.chapterSlug;
    if (!book || !slug) return;
    state = setChapterCompleted(state, book, slug, control.checked);
    writeState(window.localStorage, state);
    render();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== READING_STATE_STORAGE_KEY) return;
    state = parseReadingState(event.newValue);
    render();
  });

  render();
}

if (typeof document !== "undefined") initializeChapterStatus();
