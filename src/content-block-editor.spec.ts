import { expect, test, describe, beforeEach, vi } from "vitest";

import { ContentBlockEditor } from "./content-block-editor.ts";

describe("ContentBlockEditor", () => {
  let module: HTMLTextAreaElement;

  beforeEach(() => {
    window.contentBlocks = [];
    window.ContentBlockEditor = ContentBlockEditor;
    window.document.body.innerHTML =
      '<textarea class="my-selector"></textarea>';

    module = <HTMLTextAreaElement>document.querySelector(".my-selector");
  });

  test("it creates a container", () => {
    new window.ContentBlockEditor(module);

    expect(document.querySelector(".monaco-editor")).not.toBeNull();
  });

  test("it hides the textarea", () => {
    new window.ContentBlockEditor(module);

    const classes = Array.from(
      document.querySelector(".my-selector")?.classList || [],
    );

    expect(classes).to.include("govuk-visually-hidden");
  });

  test("it creates a button to insert a content block", () => {
    const contentBlockEditor = new window.ContentBlockEditor(module);

    const button = document.querySelector(".content-block-editor__toggle-button") as HTMLElement

    expect(button).not.toBeNull();

    const classes =  Array.from(button.classList)

    expect(classes).to.include("gem-c-button")
    expect(classes).to.include("govuk-button")

    expect(button.dataset.toggle).to.eq("modal")
    expect(button.dataset.target).to.eq("modal-default")
    expect(button.dataset.editorId).to.eq(contentBlockEditor.editor.getId())

    expect(button.innerText).to.eq("Insert Content Block")
  });

  test("it adds a reference to the editor to the global object", () => {
    const contentBlockEditor = new window.ContentBlockEditor(module);
    const editor = contentBlockEditor.editor

    expect(window.editors[editor.getId()]).toEqual(editor)
  })

  test("it throws an error if the module is not a textarea", () => {
    window.document.body.innerHTML = '<div class="my-selector"></div>';

    module = <HTMLTextAreaElement>document.querySelector(".my-selector");

    expect(() => {
      new window.ContentBlockEditor(module);
    }).toThrow('The module <div class="my-selector"></div> is not a textarea');
  });

  test("it allows the height of the editor to be specified", () => {
    module.dataset.editorHeight = "400px";
    new window.ContentBlockEditor(module);

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
    new window.ContentBlockEditor(module);

    const wrapper = document.querySelector(".content-block-editor__wrapper");

    expect(wrapper?.getAttribute("style")).toEqual("height: 40px");
  });
});
