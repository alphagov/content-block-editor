import "../scss/base.scss";
import {
  calculatePreviewPosition,
  getElementUnderPointer,
  shouldHidePreview,
} from "./content-block/hover-preview-utils.ts";
import embedRegex from "./content-block/regex.ts";

export class ContentBlockEditor {
  readonly embedPreviewDelayMs: number;
  readonly embedRenderEndpoint: string;
  textarea: HTMLTextAreaElement;
  wrapper: HTMLDivElement;
  highlight: HTMLDivElement;
  preview: HTMLDivElement;
  hoverTimerId: number | null = null;
  currentEmbedCodePreview: string | null = null;

  constructor(
    element: Element,
    embedPreviewDelayMs: number = 200,
    embedRenderEndpoint: string = "/api/blocks/render",
  ) {
    this.embedPreviewDelayMs = embedPreviewDelayMs;
    this.embedRenderEndpoint = embedRenderEndpoint;
    this.textarea = this.initializeModule(element);
    this.wrapper = this.createWrapper();
    this.highlight = this.createHighlight();
    this.preview = this.createPreview();

    this.textarea.classList.add("content-block-highlight__input");

    this.updateHighlight();

    this.textarea.addEventListener("input", () => this.updateHighlight());
    this.textarea.addEventListener("scroll", () => this.syncScroll());
    this.wrapper.addEventListener("mousemove", (event) =>
      this.updateHoverState(event),
    );
    this.wrapper.addEventListener("mouseleave", () => this.resetHoverState());

    // checks for changes to the dimensions of the textarea, and syncs the scroll position of the highlight accordingly
    // see docs: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
    if ("ResizeObserver" in window) {
      new ResizeObserver(() => this.syncScroll()).observe(this.textarea);
    }
  }

  syncScroll() {
    this.highlight.scrollTop = this.textarea.scrollTop;
    this.highlight.scrollLeft = this.textarea.scrollLeft;
  }

  initializeModule(element: Element): HTMLTextAreaElement {
    if (element instanceof HTMLTextAreaElement) {
      return element as HTMLTextAreaElement;
    } else {
      throw new Error(`The module ${element.outerHTML} is not a textarea`);
    }
  }

  createWrapper(): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "content-block-highlight__wrapper";

    this.textarea.parentNode!.insertBefore(wrapper, this.textarea);
    wrapper.appendChild(this.textarea);

    return wrapper;
  }

  createHighlight(): HTMLDivElement {
    const highlight = document.createElement("div");
    highlight.className = "govuk-textarea content-block-highlight__highlight";

    highlight.setAttribute("aria-hidden", "true");

    this.wrapper.appendChild(highlight);

    return highlight;
  }

  createPreview(): HTMLDivElement {
    const preview = document.createElement("div");
    preview.className = "content-block-highlight__preview";
    preview.hidden = true;
    preview.setAttribute("aria-hidden", "true");

    this.wrapper.appendChild(preview);

    return preview;
  }

  updateHoverState(event: MouseEvent): void {
    const elementUnderPointer = getElementUnderPointer(event, this.highlight);

    if (elementUnderPointer === null) {
      if (shouldHidePreview(this)) {
        this.resetHoverState();
      }
      return;
    }

    const embedCode = elementUnderPointer.textContent ?? "";

    if (this.currentEmbedCodePreview === embedCode) {
      return;
    }

    if (this.currentEmbedCodePreview !== null) {
      this.hidePreview();
    }

    this.clearHoverTimer();
    this.currentEmbedCodePreview = embedCode;

    this.hoverTimerId = window.setTimeout(async () => {
      this.hoverTimerId = null;
      if (
        this.currentEmbedCodePreview !== embedCode ||
        !this.highlight.contains(elementUnderPointer)
      ) {
        return;
      }

      await this.fetchAndRenderPreview(embedCode, elementUnderPointer);
    }, this.embedPreviewDelayMs);
  }

  clearHoverTimer() {
    if (this.hoverTimerId !== null) {
      window.clearTimeout(this.hoverTimerId);
      this.hoverTimerId = null;
    }
  }

  hidePreview() {
    this.preview.hidden = true;
    this.preview.setAttribute("aria-hidden", "true");
    this.preview.innerHTML = "";
  }

  resetHoverState() {
    this.clearHoverTimer();
    this.currentEmbedCodePreview = null;
    this.hidePreview();
  }

  async fetchAndRenderPreview(embedCode: string, markElement: HTMLElement) {
    try {
      const query = new URLSearchParams({ "embed_codes[]": embedCode });
      const url = `${this.embedRenderEndpoint}?${query.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        this.hidePreview();
        return;
      }

      if (this.currentEmbedCodePreview !== embedCode) {
        return;
      }
      const json = await response.json();
      const html = json.rendered_blocks?.[embedCode]?.html;

      if (!html) {
        this.hidePreview();
        return;
      }

      this.preview.innerHTML = html;
      this.positionPreview(markElement);
      this.preview.hidden = false;
      this.preview.setAttribute("aria-hidden", "false");
    } catch {
      this.hidePreview();
    }
  }

  positionPreview(markElement: HTMLElement): void {
    const position = calculatePreviewPosition(markElement, this.wrapper);
    this.preview.style.left = position.left;
    this.preview.style.top = position.top;
  }

  updateHighlight() {
    this.resetHoverState();

    let text = this.textarea.value;

    if (text[text.length - 1] === "\n") {
      text += " ";
    }

    // Escape HTML entities
    text = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Wrap matched embed codes with <mark>
    text = text.replace(
      embedRegex,
      '<mark class="content-block-highlight__mark">$&</mark>',
    );

    this.highlight.innerHTML = text;
  }

  static initAll(scope: ParentNode = document): ContentBlockEditor[] {
    const elements = scope.querySelectorAll(
      '[data-module~="content-block-highlight"]',
    );

    return Array.from(elements).map(
      (element) => new ContentBlockEditor(element),
    );
  }
}
