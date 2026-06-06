import { expect, test, describe, beforeEach, vi } from "vitest";
import {
  getElementUnderPointer,
  shouldHidePreview,
  calculatePreviewPosition,
} from "./hover-preview-utils.ts";
import { ContentBlockEditor } from "../content-block-editor.ts";

describe("getElementUnderPointer", () => {
  let highlight: HTMLElement;
  let mark: HTMLElement;

  beforeEach(() => {
    highlight = document.createElement("div");
    highlight.className = "content-block-highlight__highlight";

    mark = document.createElement("mark");
    mark.className = "content-block-highlight__mark";
    mark.textContent = "{{embed:contact:123}}";
    highlight.appendChild(mark);
  });

  test("returns the mark element when it is under the pointer and within highlight", () => {
    const event = new MouseEvent("mousemove", {
      clientX: 100,
      clientY: 100,
    });

    Object.defineProperty(document, "elementsFromPoint", {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue([mark, highlight]),
    });

    const result = getElementUnderPointer(event, highlight);

    expect(result).toBe(mark);
  });

  test("returns null when no mark is under the pointer", () => {
    const event = new MouseEvent("mousemove", {
      clientX: 100,
      clientY: 100,
    });

    const div = document.createElement("div");

    Object.defineProperty(document, "elementsFromPoint", {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue([div]),
    });

    const result = getElementUnderPointer(event, highlight);

    expect(result).toBeNull();
  });

  test("returns null when element under pointer is not an HTMLElement", () => {
    const event = new MouseEvent("mousemove", {
      clientX: 100,
      clientY: 100,
    });

    const textNode = document.createTextNode("text");

    Object.defineProperty(document, "elementsFromPoint", {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue([textNode]),
    });

    const result = getElementUnderPointer(event, highlight);

    expect(result).toBeNull();
  });

  test("returns null when mark is not within the highlight element", () => {
    const event = new MouseEvent("mousemove", {
      clientX: 100,
      clientY: 100,
    });

    const externalMark = document.createElement("mark");
    externalMark.className = "content-block-highlight__mark";

    Object.defineProperty(document, "elementsFromPoint", {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue([externalMark]),
    });

    const result = getElementUnderPointer(event, highlight);

    expect(result).toBeNull();
  });

  test("finds the mark when multiple elements are at point", () => {
    const event = new MouseEvent("mousemove", {
      clientX: 100,
      clientY: 100,
    });

    const div = document.createElement("div");
    const otherMark = document.createElement("mark");

    Object.defineProperty(document, "elementsFromPoint", {
      configurable: true,
      writable: true,
      value: vi.fn().mockReturnValue([div, otherMark, mark]),
    });

    const result = getElementUnderPointer(event, highlight);

    expect(result).toBe(mark);
  });
});

describe("shouldHidePreview", () => {
  let textarea: HTMLTextAreaElement;
  let editor: ContentBlockEditor;

  beforeEach(() => {
    document.body.innerHTML = `
      <textarea id="my-textarea"></textarea>
    `;
    textarea = document.getElementById("my-textarea") as HTMLTextAreaElement;
    editor = new ContentBlockEditor(textarea);
  });

  test("returns true when there is a pending timer", () => {
    editor.hoverTimerId = 123;
    editor.currentEmbedCodePreview = null;
    editor.preview.hidden = true;
    editor.preview.innerHTML = "";

    expect(shouldHidePreview(editor)).toBe(true);
  });

  test("returns true when there is a tracked embed code", () => {
    editor.hoverTimerId = null;
    editor.currentEmbedCodePreview = "{{embed:contact:123}}";
    editor.preview.hidden = true;
    editor.preview.innerHTML = "";

    expect(shouldHidePreview(editor)).toBe(true);
  });

  test("returns true when preview is visible", () => {
    editor.hoverTimerId = null;
    editor.currentEmbedCodePreview = null;
    editor.preview.hidden = false;
    editor.preview.innerHTML = "";

    expect(shouldHidePreview(editor)).toBe(true);
  });

  test("returns true when preview has content", () => {
    editor.hoverTimerId = null;
    editor.currentEmbedCodePreview = null;
    editor.preview.hidden = true;
    editor.preview.innerHTML = "<p>Content</p>";

    expect(shouldHidePreview(editor)).toBe(true);
  });

  test("returns false when all conditions are false", () => {
    editor.hoverTimerId = null;
    editor.currentEmbedCodePreview = null;
    editor.preview.hidden = true;
    editor.preview.innerHTML = "";

    expect(shouldHidePreview(editor)).toBe(false);
  });

  test("returns true when multiple conditions are true", () => {
    editor.hoverTimerId = 123;
    editor.currentEmbedCodePreview = "{{embed:contact:123}}";
    editor.preview.hidden = false;
    editor.preview.innerHTML = "<p>Content</p>";

    expect(shouldHidePreview(editor)).toBe(true);
  });
});

describe("calculatePreviewPosition", () => {
  let markElement: HTMLElement;
  let wrapperElement: HTMLElement;

  beforeEach(() => {
    markElement = document.createElement("mark");
    wrapperElement = document.createElement("div");
  });

  test("calculates left position as mark left minus wrapper left", () => {
    vi.spyOn(markElement, "getBoundingClientRect").mockReturnValue({
      left: 150,
      bottom: 120,
      width: 100,
      height: 20,
      top: 100,
      right: 250,
      x: 150,
      y: 100,
    } as DOMRect);

    vi.spyOn(wrapperElement, "getBoundingClientRect").mockReturnValue({
      left: 50,
      top: 10,
      width: 600,
      height: 490,
      bottom: 500,
      right: 650,
      x: 50,
      y: 10,
    } as DOMRect);

    const position = calculatePreviewPosition(markElement, wrapperElement);

    expect(position.left).toBe("100px"); // 150 - 50
  });

  test("calculates top position as mark bottom minus wrapper top plus 8px", () => {
    vi.spyOn(markElement, "getBoundingClientRect").mockReturnValue({
      left: 50,
      bottom: 120,
      width: 100,
      height: 20,
      top: 100,
      right: 150,
      x: 50,
      y: 100,
    } as DOMRect);

    vi.spyOn(wrapperElement, "getBoundingClientRect").mockReturnValue({
      left: 10,
      top: 10,
      width: 600,
      height: 490,
      bottom: 500,
      right: 610,
      x: 10,
      y: 10,
    } as DOMRect);

    const position = calculatePreviewPosition(markElement, wrapperElement);

    expect(position.top).toBe("118px"); // 120 - 10 + 8
  });

  test("returns both left and top as pixel strings", () => {
    vi.spyOn(markElement, "getBoundingClientRect").mockReturnValue({
      left: 100,
      bottom: 100,
      width: 50,
      height: 20,
      top: 80,
      right: 150,
      x: 100,
      y: 80,
    } as DOMRect);

    vi.spyOn(wrapperElement, "getBoundingClientRect").mockReturnValue({
      left: 20,
      top: 20,
      width: 500,
      height: 400,
      bottom: 420,
      right: 520,
      x: 20,
      y: 20,
    } as DOMRect);

    const position = calculatePreviewPosition(markElement, wrapperElement);

    expect(position.left).toBe("80px");
    expect(position.top).toBe("88px");
    expect(typeof position.left).toBe("string");
    expect(typeof position.top).toBe("string");
  });
});
