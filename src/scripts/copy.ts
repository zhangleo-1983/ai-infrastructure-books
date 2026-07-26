import { COPY_FEEDBACK_DURATION_MS } from "./constants";

interface ClipboardWriter {
  writeText(value: string): Promise<void>;
}

export type CopyFeedbackState = "idle" | "success" | "error";

export interface CopyFeedback {
  label: string;
  ariaLabel: string;
  message: string;
}

export function getCopyFeedback(state: CopyFeedbackState): CopyFeedback {
  if (state === "success") {
    return {
      label: "已复制",
      ariaLabel: "命令已复制",
      message: "命令已复制到剪贴板。",
    };
  }
  if (state === "error") {
    return {
      label: "复制失败",
      ariaLabel: "复制失败，请手动选择并复制命令",
      message: "复制失败，请手动选择并复制命令。",
    };
  }
  return {
    label: "复制",
    ariaLabel: "复制命令",
    message: "",
  };
}

export async function copyText(
  value: string,
  clipboard: ClipboardWriter | undefined =
    typeof navigator === "undefined" ? undefined : navigator.clipboard,
  documentObject?: Document,
): Promise<void> {
  if (clipboard?.writeText) {
    await clipboard.writeText(value);
    return;
  }

  const activeDocument = documentObject ?? document;
  const textarea = activeDocument.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  activeDocument.body.append(textarea);
  textarea.select();
  const legacyDocument = activeDocument as unknown as {
    execCommand(commandId: string): boolean;
  };
  const copied = legacyDocument.execCommand("copy");
  textarea.remove();
  if (!copied) throw new Error("浏览器拒绝复制");
}

export function initializeCopyButtons(): void {
  const timers = new WeakMap<HTMLButtonElement, number>();

  document
    .querySelectorAll<HTMLButtonElement>("[data-copy-button]")
    .forEach((button) => {
      if (button.dataset.copyReady === "true") return;
      button.dataset.copyReady = "true";
      button.hidden = false;

      button.addEventListener("click", async () => {
        const previousTimer = timers.get(button);
        if (previousTimer) window.clearTimeout(previousTimer);

        const originalLabel = button.dataset.copyLabel ?? "复制";
        button.dataset.copyLabel = originalLabel;
        const feedback = button.parentElement?.querySelector<HTMLElement>(
          "[data-copy-feedback]",
        );

        try {
          await copyText(button.dataset.copyValue ?? "");
          const success = getCopyFeedback("success");
          button.textContent = success.label;
          button.dataset.copyState = "success";
          button.setAttribute("aria-label", success.ariaLabel);
          if (feedback) feedback.textContent = success.message;
        } catch {
          const error = getCopyFeedback("error");
          button.textContent = error.label;
          button.dataset.copyState = "error";
          button.setAttribute("aria-label", error.ariaLabel);
          if (feedback) feedback.textContent = error.message;
        }

        const timer = window.setTimeout(() => {
          const idle = getCopyFeedback("idle");
          button.textContent = originalLabel || idle.label;
          button.dataset.copyState = "idle";
          button.setAttribute("aria-label", idle.ariaLabel);
          if (feedback) feedback.textContent = idle.message;
        }, COPY_FEEDBACK_DURATION_MS);
        timers.set(button, timer);
      });
    });
}

if (typeof document !== "undefined") initializeCopyButtons();
