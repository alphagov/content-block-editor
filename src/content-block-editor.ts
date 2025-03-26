import * as monaco from "monaco-editor"

export class ContentBlockEditor {
    constructor(private readonly selector: string) {}

    initialize() {
        const module = <HTMLTextAreaElement>document.querySelector(this.selector)

        if (module == null) {
            throw new Error(`Can't find selector ${this.selector}`)
        }

        const container = document.createElement('div')
        module.after(container)

        monaco.editor.create(container, {
          value: module.value
        })
    }
}
