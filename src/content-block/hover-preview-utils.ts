import type { ContentBlockEditor } from "../content-block-editor.ts";

export type HoveredEmbedMatch = {
  embedCode: string;
  hoveredMark: HTMLElement;
};

export function getElementUnderPointer(
  event: MouseEvent,
  highlight: HTMLElement,
): HTMLElement | null {
  const elementsAtPoint = document.elementsFromPoint(
    event.clientX,
    event.clientY,
  );

  const elementUnderPointer = elementsAtPoint.find((element) => {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    const isEmbedMark = element.classList.contains(
      "content-block-highlight__mark",
    );
    const isWithinHighlight = highlight.contains(element);

    return isEmbedMark && isWithinHighlight;
  });

  if (!(elementUnderPointer instanceof HTMLElement)) {
    return null;
  }

  return elementUnderPointer;
}

export function shouldHidePreview(cbd: ContentBlockEditor): boolean {
  const hasPendingTimer = cbd.hoverTimerId !== null;
  const hasTrackedEmbedCode = cbd.currentEmbedCodePreview !== null;
  const hasVisiblePreview = cbd.preview.hidden === false;
  const hasPreviewContent = cbd.preview.innerHTML !== "";

  return (
    hasPendingTimer ||
    hasTrackedEmbedCode ||
    hasVisiblePreview ||
    hasPreviewContent
  );
}

export function calculatePreviewPosition(
  markElement: HTMLElement,
  wrapperElement: HTMLElement,
): { left: string; top: string } {
  const markRect = markElement.getBoundingClientRect();
  const wrapperRect = wrapperElement.getBoundingClientRect();

  const left = `${markRect.left - wrapperRect.left}px`;
  const top = `${markRect.bottom - wrapperRect.top + 8}px`;

  return { left, top };
}
