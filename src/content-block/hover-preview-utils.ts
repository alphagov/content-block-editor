export const createHoverPreviewElement = (): HTMLDivElement => {
  const preview = document.createElement("div");
  preview.className = "content-block-highlight__preview";
  preview.hidden = true;
  preview.setAttribute("aria-hidden", "true");
  return preview;
};
