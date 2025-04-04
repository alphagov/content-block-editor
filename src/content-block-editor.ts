import "../scss/base.scss";

import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import { createEditor } from "./monaco/editor.ts";

self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  },
};

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

    element.classList.add("govuk-visually-hidden");
  }

  initializeModule = (element: Element): HTMLTextAreaElement => {
    if ("value" in element) {
      return <HTMLTextAreaElement>element;
    } else {
      throw new Error(`The module ${element.outerHTML} is not a textarea`);
    }
  };

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
