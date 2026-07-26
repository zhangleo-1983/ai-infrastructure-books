export function initializeMobileTableOfContents(): void {
  const mobileLayout = window.matchMedia("(max-width: 64rem)");
  const tables = Array.from(
    document.querySelectorAll<HTMLDetailsElement>("[data-table-of-contents]"),
  );

  for (const table of tables) {
    const summary = table.querySelector<HTMLElement>("summary");

    if (
      mobileLayout.matches &&
      table.dataset.currentChapter === "true"
    ) {
      table.open = false;
    }

    table.addEventListener("toggle", () => {
      table.dataset.mobileOpen = String(table.open);
    });

    table.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((link) => {
      link.addEventListener("click", () => {
        if (mobileLayout.matches) table.open = false;
      });
    });

    table.addEventListener("keydown", (event) => {
      if (
        event.key !== "Escape" ||
        !mobileLayout.matches ||
        !table.open
      ) {
        return;
      }

      event.preventDefault();
      table.open = false;
      summary?.focus();
    });

    table.dataset.mobileOpen = String(table.open);
  }
}

if (typeof document !== "undefined") initializeMobileTableOfContents();
