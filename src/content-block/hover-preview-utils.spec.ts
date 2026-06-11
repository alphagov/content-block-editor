import { describe, test, expect, beforeEach } from "vitest";
import { createHoverPreviewElement } from "./hover-preview-utils";

describe("createHoverPreviewElement", () => {
  let preview: HTMLDivElement;

  beforeEach(() => {
    preview = createHoverPreviewElement();
  });

  test("it returns an HTMLDivElement", () => {
    expect(preview).toBeInstanceOf(HTMLDivElement);
  });

  test("it sets the className to content-block-highlight__preview", () => {
    expect(preview.className).toBe("content-block-highlight__preview");
  });

  test("it sets the hidden attribute to true", () => {
    expect(preview.hidden).toBe(true);
  });

  test("it sets the aria-hidden attribute to true", () => {
    expect(preview.getAttribute("aria-hidden")).toBe("true");
  });

  test("it creates an independent element each time", () => {
    const previewTwo = createHoverPreviewElement();

    expect(preview).not.toBe(previewTwo);
    expect(preview.className).toBe(previewTwo.className);
  });
});
