import { expect, test, describe, beforeEach, vi } from "vitest";

import { ContentBlockEditor } from "./content-block-editor.ts";

describe("ContentBlockEditor", () => {
  let module: HTMLTextAreaElement;

  beforeEach(() => {
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
