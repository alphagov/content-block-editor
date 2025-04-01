import "../scss/base.scss"

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker"
import tokens from "./monaco/tokens.ts";
import theme from "./monaco/theme.ts";
import variables from "./variables.module.scss";

self.MonacoEnvironment = {
    getWorker(_, _label) {
        return new editorWorker()
    }
}

export class ContentBlockEditor {
    editor: monaco.editor.IStandaloneCodeEditor | undefined;
    themeName = "content-block-editor"
    languageId = "govspeak"

    constructor(private readonly selector: string) {
        monaco.languages.register({ id: this.languageId });
        monaco.languages.setMonarchTokensProvider(this.languageId, tokens)
        monaco.editor.defineTheme(this.themeName, theme);
    }

    initialize() {
        const module = <HTMLTextAreaElement>document.querySelector(this.selector)

        if (module == null) {
            throw new Error(`Can't find selector ${this.selector}`)
        }

        const styles = window.getComputedStyle(module)
        const height = module.dataset.editorHeight || styles.height

        const container = document.createElement('div')
        container.classList.add("content-block-editor__wrapper")
        container.setAttribute("style", `height: ${height}`)
        module.after(container)

        module.classList.add("govuk-visually-hidden")

        this.editor = monaco.editor.create(container, {
          value: module.value,
          language: this.languageId,
          minimap: { enabled: false },
          lineNumbers: "off",
          fontFamily: variables.fontFamily,
          fontSize: 19,
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          theme: this.themeName,
          wordWrap: "on",
        })

        this.editor.onDidChangeModelContent(() => {
            module.value = <string>this.editor?.getValue()
        })

        this.editor.onDidFocusEditorText(() => {
            container.classList.add("content-block-editor__wrapper--focussed")
        })

        this.editor.onDidBlurEditorText(() => {
            container.classList.remove("content-block-editor__wrapper--focussed")
        })
    }
}

window.ContentBlockEditor = ContentBlockEditor;
