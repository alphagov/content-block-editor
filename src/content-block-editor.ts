import * as monaco from "monaco-editor"
import tokens from "./monaco/tokens.ts";

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

        const container = document.createElement('div')
        module.after(container)

        this.editor = monaco.editor.create(container, {
          value: module.value
        })
    }
}
