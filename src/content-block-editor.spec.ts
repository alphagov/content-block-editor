import { expect, test, describe, beforeEach, vi, afterEach } from "vitest";

import { ContentBlockEditor } from "./content-block-editor.ts";
import variables from "./variables.module.scss";

describe("ContentBlockEditor", () => {
  let module: HTMLTextAreaElement;
  let contentBlockEditor: ContentBlockEditor;

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    window.ContentBlockEditor = ContentBlockEditor;
    window.document.body.innerHTML =
      '<textarea class="my-selector"></textarea>';

    module = <HTMLTextAreaElement>document.querySelector(".my-selector");
    contentBlockEditor = new window.ContentBlockEditor(module);
  });

  afterEach(() => {
    vi.advanceTimersByTime(250);
  });

  test("it creates a container", () => {
    contentBlockEditor.initialize();

    expect(document.querySelector(".monaco-editor")).not.toBeNull();
  });

  test("it hides the textarea", () => {
    contentBlockEditor.initialize();

    const classes = Array.from(
      document.querySelector(".my-selector")?.classList || [],
    );

    expect(classes).to.include("govuk-visually-hidden");
  });

  test("it throws an error if the module is not a textarea", () => {
    window.document.body.innerHTML = '<div class="my-selector"></div>';

    module = <HTMLTextAreaElement>document.querySelector(".my-selector");

    expect(() => {
      new window.ContentBlockEditor(module);
    }).toThrow('The module <div class="my-selector"></div> is not a textarea');
  });

  test("it copies the value from the textarea", () => {
    module.value = "Some text is here";

    contentBlockEditor.initialize();
    const editor = contentBlockEditor.editor;

    expect(editor?.getValue()).toEqual("Some text is here");
  });

  test("it sets font styles correctly", () => {
    contentBlockEditor.initialize();
    const editor = contentBlockEditor.editor;

    const options = editor?.getRawOptions();

    expect(options?.fontFamily).toEqual(variables.fontFamily);
    expect(options?.fontSize).toEqual(19);
  });

  test("it allows the height of the editor to be specified", () => {
    module.dataset.editorHeight = "400px";
    contentBlockEditor.initialize();

    const wrapper = document.querySelector(".content-block-editor__wrapper");

    expect(wrapper?.getAttribute("style")).toEqual("height: 400px");
  });

  test("it gets the height of the textarea if a custom height is not specified", () => {
    window.getComputedStyle = vi.fn().mockImplementation(() => {
      return {
        height: "40px",
        fontSize: "20px",
      };
    });

    contentBlockEditor.initialize();

    const wrapper = document.querySelector(".content-block-editor__wrapper");

    expect(wrapper?.getAttribute("style")).toEqual("height: 40px");
  });

  test("it updates the textarea when the editor is updated", () => {
    contentBlockEditor.initialize();

    contentBlockEditor.editor?.setValue("I'm updating text here!");

    const module = <HTMLTextAreaElement>document.querySelector(".my-selector");

    expect(module.value).to.eq("I'm updating text here!");
  });
});
