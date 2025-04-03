import { beforeEach, describe, expect, test } from "vitest";
import variables from "../variables.module.scss";
import { createEditor } from "./editor.ts";

describe("createEditor", () => {
  const container = window.document.createElement("div");
  const textarea = window.document.createElement("textarea");
  const header = window.document.createElement("h1");

  beforeEach(() => {
    document.body.appendChild(header);
    document.body.appendChild(container);
    document.body.appendChild(textarea);
  });

  test("it sets font styles correctly", () => {
    const editor = createEditor(container, textarea);
    const options = editor?.getRawOptions();

    expect(options?.fontFamily).toEqual(variables.fontFamily);
    expect(options?.fontSize).toEqual(19);
  });

  test("it updates the textarea value when an edit occurs", () => {
    const editor = createEditor(container, textarea);
    editor.trigger("keyboard", "type", { text: "test" });

    expect(textarea.value).toEqual("test");
  });

  test("it sets a focussed class on the container when the editor receives focus", () => {
    const editor = createEditor(container, textarea);
    editor.focus();

    const classes = Array.from(container.classList || []);

    expect(classes).to.include("content-block-editor__wrapper--focussed");
  });

  test("it removes the focussed class from the container when the editor loses focus", () => {
    const editor = createEditor(container, textarea);
    editor.focus();
    header.focus();

    const classes = Array.from(container.classList || []);

    expect(classes).to.include("content-block-editor__wrapper--focussed");
  });

  test("it copies the value from the textarea", () => {
    textarea.value = "Some text is here";
    const editor = createEditor(container, textarea);

    expect(editor?.getValue()).toEqual("Some text is here");
  });
});
