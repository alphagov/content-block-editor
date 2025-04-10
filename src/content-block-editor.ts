import "../scss/base.scss";

import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { createEditor } from "./monaco/editor.ts";
import { ContentBlockBrowser } from "./content-block/content-block-browser.ts";

self.editors = {};

self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  },
};

self.contentBlockBrowser = new ContentBlockBrowser();

export class ContentBlockEditor {
  module: HTMLTextAreaElement;
  container: HTMLDivElement;
  editor: editor.IStandaloneCodeEditor;

  themeName = "content-block-editor";
  languageId = "govspeak";

  constructor(element: Element) {
    this.module = this.initializeModule(element);
    this.container = this.createContainer();
    this.editor = createEditor(this.container, this.module);
    this.createToolbar();

    element.classList.add("govuk-visually-hidden");

    self.editors[this.editor.getId()] = this.editor;
  }

  initializeModule = (element: Element): HTMLTextAreaElement => {
    if ("value" in element) {
      return <HTMLTextAreaElement>element;
    } else {
      throw new Error(`The module ${element.outerHTML} is not a textarea`);
    }
  };

  createToolbar() {
    const insertButton = document.createElement("button");
    insertButton.classList.add(
      "gem-c-button",
      "govuk-button",
      "content-block-editor__toggle-button",
    );
    insertButton.innerText = "Insert Content Block";

    insertButton.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      const modal = self.contentBlockBrowser.modal.module;
      modal.open();
      modal.dataset.editorId = this.editor.getId();
    });

    this.container.before(insertButton);
  }

  createContainer(): HTMLDivElement {
    const styles = window.getComputedStyle(this.module);
    const height = this.module.dataset.editorHeight || styles.height;

    const container = document.createElement("div");
    container.classList.add("content-block-editor__wrapper");
    container.setAttribute("style", `height: ${height}`);

    this.module.after(container);

    return container;
  }
}

window.ContentBlockEditor = ContentBlockEditor;
