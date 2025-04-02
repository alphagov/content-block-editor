import "../scss/base.scss";

import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tokens from "./monaco/tokens.ts";
import theme from "./monaco/theme.ts";
import variables from "./variables.module.scss";

self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker();
  },
};

export class ContentBlockEditor {
  module: HTMLTextAreaElement;
  container: HTMLDivElement;
  editor: monaco.editor.IStandaloneCodeEditor;

  themeName = "content-block-editor";
  languageId = "govspeak";

  constructor(element: Element) {
    this.module = this.initializeModule(element);
    this.container = this.createContainer();
    this.editor = this.createEditor();
  }

  initializeModule = (element: Element): HTMLTextAreaElement => {
    if ("value" in element) {
      element.classList.add("govuk-visually-hidden")
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

  createEditor() {
    monaco.languages.register({ id: this.languageId });
    monaco.languages.setMonarchTokensProvider(this.languageId, tokens);
    monaco.editor.defineTheme(this.themeName, theme);

    const editor = monaco.editor.create(this.container, {
      value: this.module.value,
      language: this.languageId,
      minimap: { enabled: false },
      lineNumbers: "off",
      fontFamily: variables.fontFamily,
      fontSize: 19,
      glyphMargin: false,
      folding: false,
      lineDecorationsWidth: 5,
      lineNumbersMinChars: 0,
      theme: this.themeName,
      padding: {
        top: 5,
        bottom: 5,
      },
      wordWrap: "on",
    });

    editor.onDidChangeModelContent(() => {
      this.module.value = <string>this.editor?.getValue();
    });

    editor.onDidFocusEditorText(() => {
      this.container.classList.add("content-block-editor__wrapper--focussed");
    });

    editor.onDidBlurEditorText(() => {
      this.container.classList.remove(
        "content-block-editor__wrapper--focussed",
      );
    });

    return editor;
  }
}

window.ContentBlockEditor = ContentBlockEditor;
