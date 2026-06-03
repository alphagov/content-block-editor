import "../scss/base.scss";
import embedRegex from "./content-block/regex.ts";

const EMBED_PREVIEW_DELAY_MS = 200;
const EMBED_RENDER_ENDPOINT = "/api/blocks/render";

export class ContentBlockEditor {
  textarea: HTMLTextAreaElement;
  wrapper: HTMLDivElement;
  highlight: HTMLDivElement;
  preview: HTMLDivElement;
  hoverTimerId: number | null = null;
  hoveredEmbedCode: string | null = null;

  constructor(element: Element) {
    this.textarea = this.initializeModule(element);
    this.wrapper = this.createWrapper();
    this.highlight = this.createHighlight();
    this.preview = this.createPreview();

    this.textarea.classList.add("content-block-highlight__input");

    this.updateHighlight();

    this.textarea.addEventListener("input", () => this.updateHighlight());
    this.textarea.addEventListener("scroll", () => this.syncScroll());
    this.wrapper.addEventListener("mousemove", (event) =>
      this.handleMouseMove(event),
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

  getHoveredMark(event: MouseEvent): HTMLElement | null {
    const elements = document.elementsFromPoint(event.clientX, event.clientY);

    return (
      (elements.find(
        (element) =>
          element instanceof HTMLElement &&
          element.classList.contains("content-block-highlight__mark") &&
          this.highlight.contains(element),
      ) as HTMLElement | undefined) ?? null
    );
  }

  handleMouseMove(event: MouseEvent) {
    const hoveredMark = this.getHoveredMark(event);

    if (!hoveredMark) {
      if (this.hasActiveHoverState()) {
        this.resetHoverState();
      }
      return;
    }

    const embedCode = hoveredMark.textContent ?? "";

    if (!embedCode || this.hoveredEmbedCode === embedCode) {
      return;
    }

    if (this.hoveredEmbedCode !== null) {
      this.hidePreview();
    }

    this.clearHoverTimer();
    this.hoveredEmbedCode = embedCode;

    this.hoverTimerId = window.setTimeout(async () => {
      if (
        this.hoveredEmbedCode !== embedCode ||
        !this.highlight.contains(hoveredMark)
      ) {
        return;
      }

      await this.fetchAndRenderPreview(embedCode, hoveredMark);
    }, EMBED_PREVIEW_DELAY_MS);
  }

  clearHoverTimer() {
    if (this.hoverTimerId !== null) {
      window.clearTimeout(this.hoverTimerId);
      this.hoverTimerId = null;
    }
  }

  hidePreview() {
    if (this.preview.hidden && this.preview.innerHTML === "") {
      return;
    }

    this.preview.hidden = true;
    this.preview.innerHTML = "";
  }

  hasActiveHoverState() {
    return (
      this.hoverTimerId !== null ||
      this.hoveredEmbedCode !== null ||
      !this.preview.hidden ||
      this.preview.innerHTML !== ""
    );
  }

  resetHoverState() {
    this.clearHoverTimer();
    this.hoveredEmbedCode = null;
    this.hidePreview();
  }

  async fetchAndRenderPreview(embedCode: string, markElement: HTMLElement) {
    try {
      const query = new URLSearchParams({ "embed_codes[]": embedCode });
      const url = `${EMBED_RENDER_ENDPOINT}?${query.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        this.hidePreview();
        return;
      }

      const json = await response.json();

      if (this.hoveredEmbedCode !== embedCode) {
        return;
      }

      const html = json.rendered_blocks?.[embedCode]?.html;

      if (!html) {
        this.hidePreview();
        return;
      }

      this.preview.innerHTML = html;
      this.positionPreview(markElement);
      this.preview.hidden = false;
    } catch {
      this.hidePreview();
    }
  }

  positionPreview(markElement: HTMLElement) {
    const markRect = markElement.getBoundingClientRect();
    const wrapperRect = this.wrapper.getBoundingClientRect();

    this.preview.style.left = `${markRect.left - wrapperRect.left}px`;
    this.preview.style.top = `${markRect.bottom - wrapperRect.top + 8}px`;
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
