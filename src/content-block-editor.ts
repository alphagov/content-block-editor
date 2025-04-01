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
  editor: monaco.editor.IStandaloneCodeEditor | undefined;
  themeName = "content-block-editor";
  languageId = "govspeak";

  constructor(module: Element) {
    if ("value" in module) {
      this.module = <HTMLTextAreaElement>module;
    } else {
      throw new Error(`The module ${module.outerHTML} is not a textarea`);
    }

    monaco.languages.register({ id: this.languageId });
    monaco.languages.setMonarchTokensProvider(this.languageId, tokens);
    monaco.editor.defineTheme(this.themeName, theme);
  }

  initialize() {
    const styles = window.getComputedStyle(this.module);
    const height = this.module.dataset.editorHeight || styles.height;

    const container = document.createElement("div");
    container.classList.add("content-block-editor__wrapper");
    container.setAttribute("style", `height: ${height}`);
    this.module.after(container);

    this.module.classList.add("govuk-visually-hidden");

    this.editor = monaco.editor.create(container, {
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

    this.editor.onDidChangeModelContent(() => {
      this.module.value = <string>this.editor?.getValue();
    });

    this.editor.onDidFocusEditorText(() => {
      container.classList.add("content-block-editor__wrapper--focussed");
    });

    this.editor.onDidBlurEditorText(() => {
      container.classList.remove("content-block-editor__wrapper--focussed");
    });
  }
}

window.ContentBlockEditor = ContentBlockEditor;
