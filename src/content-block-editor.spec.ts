import {expect, test, describe, beforeEach, vi, afterEach} from 'vitest'

import { ContentBlockEditor } from "./content-block-editor.ts"

describe("ContentBlockEditor", () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });

        window.ContentBlockEditor = ContentBlockEditor
        window.document.body.innerHTML = '<textarea class="my-selector"></textarea>'
    })

    afterEach(() => {
        vi.advanceTimersByTime(250)
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

    test("it copies the value from the textarea", () => {
        window.document.body.innerHTML = '<textarea class="my-selector">Some text is here</textarea>'

        const contentBlockEditor = new window.ContentBlockEditor(".my-selector")
        contentBlockEditor.initialize()
        const editor = contentBlockEditor.editor

        expect(editor?.getValue()).toEqual("Some text is here")
    })

    test("it gets computed styles from the textarea", () => {
        window.getComputedStyle = vi.fn().mockImplementation(() => {
            return {
                fontFamily: "Comic Sans",
                fontSize: "100px"
            }
        })

        const contentBlockEditor = new window.ContentBlockEditor(".my-selector")
        contentBlockEditor.initialize()
        const editor = contentBlockEditor.editor

        const options = editor?.getRawOptions()

        expect(options?.fontFamily).toEqual('Comic Sans')
        expect(options?.fontSize).toEqual(100)
    })
})
