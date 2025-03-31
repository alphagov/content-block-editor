import * as monaco from "monaco-editor"
import tokens from "./monaco/tokens.ts";
import variables from "./variables.module.scss";

export class ContentBlockEditor {
    editor: monaco.editor.IStandaloneCodeEditor | undefined;
    constructor(private readonly selector: string) {
        monaco.languages.register({ id: "govspeak" });
        monaco.languages.setMonarchTokensProvider("govspeak", tokens)
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
          language: "govspeak",
          minimap: { enabled: false },
          lineNumbers: "off",
          fontFamily: variables.fontFamily,
          fontSize: 19,
          glyphMargin: false,
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
        })
    }
}
