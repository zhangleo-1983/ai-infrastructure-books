import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_RESULT_LIMIT,
} from "./constants";

interface PagefindSubResult {
  title?: string;
  url?: string;
  excerpt?: string;
}

interface PagefindResultData {
  url: string;
  excerpt?: string;
  meta?: Record<string, unknown>;
  sub_results?: PagefindSubResult[];
}

interface PagefindResult {
  data(): Promise<PagefindResultData>;
}

interface PagefindSearchResponse {
  results: PagefindResult[];
}

interface PagefindApi {
  init(): Promise<void>;
  options(options: { baseUrl: string }): Promise<void>;
  search(query: string): Promise<PagefindSearchResponse>;
}

function textMetadata(
  metadata: Record<string, unknown> | undefined,
  key: string,
): string {
  const value = metadata?.[key];
  return typeof value === "string" ? value : "";
}

export function appendSafeExcerpt(
  target: HTMLElement,
  excerpt: string,
  documentObject: Document = document,
): void {
  const parsed = new DOMParser().parseFromString(excerpt, "text/html");
  for (const node of Array.from(parsed.body.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      target.append(documentObject.createTextNode(node.textContent ?? ""));
      continue;
    }

    if (
      node instanceof HTMLElement &&
      node.tagName.toLowerCase() === "mark"
    ) {
      const mark = documentObject.createElement("mark");
      mark.textContent = node.textContent;
      target.append(mark);
      continue;
    }

    target.append(documentObject.createTextNode(node.textContent ?? ""));
  }
}

export function initializeSearch(): void {
  const trigger = document.querySelector<HTMLButtonElement>(
    "[data-search-open]",
  );
  const dialog = document.querySelector<HTMLDialogElement>(
    "[data-search-dialog]",
  );
  const closeButton = dialog?.querySelector<HTMLButtonElement>(
    "[data-search-close]",
  );
  const input = dialog?.querySelector<HTMLInputElement>("[data-search-input]");
  const status = dialog?.querySelector<HTMLElement>("[data-search-status]");
  const results = dialog?.querySelector<HTMLOListElement>(
    "[data-search-results]",
  );
  if (!trigger || !dialog || !closeButton || !input || !status || !results) {
    return;
  }

  const triggerElement = trigger;
  const dialogElement = dialog;
  const inputElement = input;
  const statusElement = status;
  const resultsElement = results;
  const bundleUrl = dialog.dataset.pagefindUrl;
  const baseUrl = dialog.dataset.baseUrl ?? "/";
  if (!bundleUrl) return;
  const pagefindBundleUrl = bundleUrl;

  let pagefindPromise: Promise<PagefindApi> | undefined;
  let debounceTimer = 0;
  let searchSequence = 0;

  async function loadPagefind(): Promise<PagefindApi> {
    if (!pagefindPromise) {
      pagefindPromise = import(/* @vite-ignore */ pagefindBundleUrl).then(
        async (module) => {
          const pagefind = module as unknown as PagefindApi;
          await pagefind.options({ baseUrl });
          await pagefind.init();
          return pagefind;
        },
      );
    }
    return pagefindPromise;
  }

  function openSearch(): void {
    triggerElement.setAttribute("aria-expanded", "true");
    if (!dialogElement.open) {
      if (typeof dialogElement.showModal === "function") {
        dialogElement.showModal();
      } else {
        dialogElement.setAttribute("open", "");
      }
    }
    window.requestAnimationFrame(() => inputElement.focus());
    void loadPagefind().catch(() => {
      statusElement.textContent =
        "搜索索引尚未生成。开发时请先运行 npm run build，再使用 npm run preview。";
      statusElement.dataset.state = "error";
    });
  }

  function closeSearch(): void {
    if (!dialogElement.open) return;
    if (typeof dialogElement.close === "function") dialogElement.close();
    else dialogElement.removeAttribute("open");
  }

  function setStatus(message: string, state: string): void {
    statusElement.textContent = message;
    statusElement.dataset.state = state;
  }

  async function search(query: string): Promise<void> {
    const sequence = ++searchSequence;
    resultsElement.replaceChildren();

    if (!query.trim()) {
      setStatus("输入章节标题、术语或正文关键词。", "idle");
      return;
    }

    setStatus("正在加载搜索结果…", "loading");

    try {
      const pagefind = await loadPagefind();
      const response = await pagefind.search(query.trim());
      const resultData = await Promise.all(
        response.results
          .slice(0, SEARCH_RESULT_LIMIT)
          .map((result) => result.data()),
      );
      if (sequence !== searchSequence) return;

      if (resultData.length === 0) {
        setStatus(`没有找到与“${query.trim()}”相关的内容。`, "empty");
        return;
      }

      for (const data of resultData) {
        const subResult = data.sub_results?.[0];
        const href = subResult?.url || data.url;
        const pageTitle = textMetadata(data.meta, "title") || "未命名章节";
        const sectionTitle = subResult?.title;
        const excerpt = subResult?.excerpt || data.excerpt || "";
        const book = textMetadata(data.meta, "book") || "AI 基础设施从零开始";

        const item = document.createElement("li");
        const link = document.createElement("a");
        const title = document.createElement("strong");
        const bookLabel = document.createElement("small");
        const excerptElement = document.createElement("p");

        link.href = href;
        link.className = "search-result";
        title.textContent =
          sectionTitle && sectionTitle !== pageTitle
            ? `${pageTitle} · ${sectionTitle}`
            : pageTitle;
        bookLabel.textContent = book;
        appendSafeExcerpt(excerptElement, excerpt);

        link.append(bookLabel, title, excerptElement);
        item.append(link);
        resultsElement.append(item);
      }

      setStatus(`找到 ${response.results.length} 个相关章节。`, "ready");
    } catch {
      if (sequence !== searchSequence) return;
      setStatus(
        "搜索暂时无法加载。请确认已完成 production build，并通过 preview 访问。",
        "error",
      );
    }
  }

  triggerElement.hidden = false;
  triggerElement.addEventListener("click", openSearch);
  closeButton.addEventListener("click", closeSearch);
  dialogElement.addEventListener("close", () => {
    triggerElement.setAttribute("aria-expanded", "false");
    triggerElement.focus();
  });
  dialogElement.addEventListener("click", (event) => {
    if (event.target === dialogElement) closeSearch();
  });

  inputElement.addEventListener("input", () => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(
      () => void search(inputElement.value),
      SEARCH_DEBOUNCE_MS,
    );
  });

  inputElement.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown") return;
    const firstResult = resultsElement.querySelector<HTMLAnchorElement>("a");
    if (!firstResult) return;
    event.preventDefault();
    firstResult.focus();
  });

  resultsElement.addEventListener("keydown", (event) => {
    if (
      !["ArrowDown", "ArrowUp", "Home", "End", "Enter"].includes(
        event.key,
      )
    ) {
      return;
    }
    const links = Array.from(
      resultsElement.querySelectorAll<HTMLAnchorElement>("a"),
    );
    const currentIndex = links.indexOf(
      document.activeElement as HTMLAnchorElement,
    );
    if (currentIndex < 0 || links.length === 0) return;

    event.preventDefault();
    if (event.key === "Enter") {
      links[currentIndex]?.click();
      return;
    }

    let nextIndex = currentIndex;
    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % links.length;
    if (event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + links.length) % links.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = links.length - 1;
    links[nextIndex]?.focus();
  });

  document.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement | null;
    const editing =
      target?.matches("input, textarea, select, [contenteditable='true']") ??
      false;
    const commandSearch = (event.metaKey || event.ctrlKey) && event.key === "k";
    const slashSearch = event.key === "/" && !editing;
    if (!commandSearch && !slashSearch) return;

    event.preventDefault();
    openSearch();
  });
}

if (typeof document !== "undefined") initializeSearch();
