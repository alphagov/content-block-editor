import "../scss/base.scss";
import embedRegex from "./content-block/regex.ts";

export class ContentBlockEditor {
  textarea: HTMLTextAreaElement;
  wrapper: HTMLDivElement;
  highlight: HTMLDivElement;

  constructor(element: Element) {
    this.textarea = this.initializeModule(element);
    this.wrapper = this.createWrapper();
    this.highlight = this.createHighlight();

    this.textarea.classList.add("content-block-highlight__input");

    this.updateHighlight();

    this.textarea.addEventListener("input", () => this.updateHighlight());
    this.textarea.addEventListener("scroll", () => this.syncScroll());

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

  updateHighlight() {
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
      '[data-module="content-block-highlight"]',
    );

    return Array.from(elements).map(
      (element) => new ContentBlockEditor(element),
    );
  }
}
