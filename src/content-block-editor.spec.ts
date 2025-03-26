import {expect, test, describe, beforeEach} from 'vitest'

import { ContentBlockEditor } from "./content-block-editor.ts"

describe("ContentBlockEditor", () => {
    beforeEach(() => {
        window.ContentBlockEditor = ContentBlockEditor
        window.document.body.innerHTML = '<textarea class="my-selector"></textarea>'
    })

    test("it creates a container", () => {
        const contentBlockEditor = new window.ContentBlockEditor(".my-selector")
        contentBlockEditor.initialize()

        expect(document.querySelector(".monaco-editor")).not.toBeNull
    })

    test("it throws an error if the selector doesn't exist", () => {
        const contentBlockEditor = new window.ContentBlockEditor(".another-selector")

        expect(() => {
            contentBlockEditor.initialize()
        }).toThrow("Can't find selector .another-selector")
    })
})
