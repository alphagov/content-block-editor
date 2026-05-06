const r = [
  "contact",
  "content_block_pension",
  "content_block_contact",
  "content_block_tax",
  "content_block_time_period"
], n = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/, h = /[a-z0-9\-–—]+/, l = /(\/[a-z0-9_\-–—/]*)?/, s = new RegExp(
  `(\\{\\{embed:(${r.join("|")}):(${n.source}|${h.source})${l.source}\\}\\})`,
  "g"
);
class e {
  textarea;
  wrapper;
  highlight;
  constructor(t) {
    this.textarea = this.initializeModule(t), this.wrapper = this.createWrapper(), this.highlight = this.createHighlight(), this.textarea.classList.add("content-block-highlight__input"), this.updateHighlight(), this.textarea.addEventListener("input", () => this.updateHighlight()), this.textarea.addEventListener("scroll", () => this.syncScroll()), "ResizeObserver" in window && new ResizeObserver(() => this.syncScroll()).observe(this.textarea);
  }
  syncScroll() {
    this.highlight.scrollTop = this.textarea.scrollTop, this.highlight.scrollLeft = this.textarea.scrollLeft;
  }
  initializeModule(t) {
    if (t instanceof HTMLTextAreaElement)
      return t;
    throw new Error(`The module ${t.outerHTML} is not a textarea`);
  }
  createWrapper() {
    const t = document.createElement("div");
    return t.className = "content-block-highlight__wrapper", this.textarea.parentNode.insertBefore(t, this.textarea), t.appendChild(this.textarea), t;
  }
  createHighlight() {
    const t = document.createElement("div");
    return t.className = "govuk-textarea content-block-highlight__highlight", t.setAttribute("aria-hidden", "true"), this.wrapper.appendChild(t), t;
  }
  updateHighlight() {
    let t = this.textarea.value;
    t[t.length - 1] === `
` && (t += " "), t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), t = t.replace(
      s,
      '<mark class="content-block-highlight__mark">$&</mark>'
    ), this.highlight.innerHTML = t;
  }
  static initAll(t = document) {
    const i = t.querySelectorAll(
      '[data-module~="content-block-highlight"]'
    );
    return Array.from(i).map(
      (a) => new e(a)
    );
  }
}
export {
  e as ContentBlockEditor
};
