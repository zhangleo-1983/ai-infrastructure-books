export interface ReadingProgressGeometry {
  scrollY: number;
  contentTop: number;
  contentHeight: number;
  viewportHeight: number;
  headerHeight: number;
}

export function calculateReadingProgress({
  scrollY,
  contentTop,
  contentHeight,
  viewportHeight,
  headerHeight,
}: ReadingProgressGeometry): number {
  const readableViewport = Math.max(1, viewportHeight - headerHeight);
  const scrollableContent = Math.max(1, contentHeight - readableViewport);
  const viewedContent = scrollY + headerHeight - contentTop;
  return Math.min(1, Math.max(0, viewedContent / scrollableContent));
}

export function initializeReadingProgress(): void {
  const content = document.querySelector<HTMLElement>("[data-reading-content]");
  const progress = document.querySelector<HTMLElement>(
    "[data-reading-progress]",
  );
  const bar = progress?.querySelector<HTMLElement>("[data-reading-progress-bar]");
  if (!content || !progress || !bar) return;

  const contentElement = content;
  const progressElement = progress;
  const barElement = bar;
  let frame = 0;

  function update(): void {
    frame = 0;
    const contentRect = contentElement.getBoundingClientRect();
    const header = document.querySelector<HTMLElement>(".site-header");
    const value = calculateReadingProgress({
      scrollY: window.scrollY,
      contentTop: contentRect.top + window.scrollY,
      contentHeight: contentElement.scrollHeight,
      viewportHeight: window.innerHeight,
      headerHeight: header?.offsetHeight ?? 0,
    });
    const percent = Math.round(value * 100);

    barElement.style.transform = `scaleX(${value})`;
    progressElement.setAttribute("aria-valuenow", String(percent));
    progressElement.setAttribute("aria-valuetext", `已阅读 ${percent}%`);
  }

  function scheduleUpdate(): void {
    if (frame !== 0) return;
    frame = window.requestAnimationFrame(update);
  }

  progressElement.hidden = false;
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  scheduleUpdate();
}

if (typeof document !== "undefined") initializeReadingProgress();
