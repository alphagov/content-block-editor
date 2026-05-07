//#region src/content-block/regex.ts
var e = RegExp(`(\\{\\{embed:(${[
	"contact",
	"content_block_pension",
	"content_block_contact",
	"content_block_tax",
	"content_block_time_period"
].join("|")}):([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[a-z0-9\\-–—]+)(\\/[a-z0-9_\\-–—/]*)?\\}\\})`, "g"), t = class t {
	textarea;
	wrapper;
	highlight;
	constructor(e) {
		this.textarea = this.initializeModule(e), this.wrapper = this.createWrapper(), this.highlight = this.createHighlight(), this.textarea.classList.add("content-block-highlight__input"), this.updateHighlight(), this.textarea.addEventListener("input", () => this.updateHighlight()), this.textarea.addEventListener("scroll", () => this.syncScroll()), "ResizeObserver" in window && new ResizeObserver(() => this.syncScroll()).observe(this.textarea);
	}
	syncScroll() {
		this.highlight.scrollTop = this.textarea.scrollTop, this.highlight.scrollLeft = this.textarea.scrollLeft;
	}
	initializeModule(e) {
		if (e instanceof HTMLTextAreaElement) return e;
		throw Error(`The module ${e.outerHTML} is not a textarea`);
	}
	createWrapper() {
		let e = document.createElement("div");
		return e.className = "content-block-highlight__wrapper", this.textarea.parentNode.insertBefore(e, this.textarea), e.appendChild(this.textarea), e;
	}
	createHighlight() {
		let e = document.createElement("div");
		return e.className = "govuk-textarea content-block-highlight__highlight", e.setAttribute("aria-hidden", "true"), this.wrapper.appendChild(e), e;
	}
	updateHighlight() {
		let t = this.textarea.value;
		t[t.length - 1] === "\n" && (t += " "), t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), t = t.replace(e, "<mark class=\"content-block-highlight__mark\">$&</mark>"), this.highlight.innerHTML = t;
	}
	static initAll(e = document) {
		let n = e.querySelectorAll("[data-module~=\"content-block-highlight\"]");
		return Array.from(n).map((e) => new t(e));
	}
};
//#endregion
export { t as ContentBlockEditor };
