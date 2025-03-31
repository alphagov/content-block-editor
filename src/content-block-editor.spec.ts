import {expect, test, describe, beforeEach, vi, afterEach} from 'vitest'

import { ContentBlockEditor } from "./content-block-editor.ts"
import variables from "./variables.module.scss";

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

    test("it hides the textarea", () => {
        const contentBlockEditor = new window.ContentBlockEditor(".my-selector")
        contentBlockEditor.initialize()

        const classes = Array.from(document.querySelector(".my-selector")?.classList || [])

        expect(classes).to.include("govuk-visually-hidden")
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

    test("it sets font styles correctly", () => {
        const contentBlockEditor = new window.ContentBlockEditor(".my-selector")
        contentBlockEditor.initialize()
        const editor = contentBlockEditor.editor

        const options = editor?.getRawOptions()

        expect(options?.fontFamily).toEqual(variables.fontFamily)
        expect(options?.fontSize).toEqual(19)
    })

    test("it allows the height of the editor to be specified", () => {
        window.document.body.innerHTML = '<textarea class="my-selector" data-editor-height="400px">Some text is here</textarea>'
        const contentBlockEditor = new window.ContentBlockEditor(".my-selector")
        contentBlockEditor.initialize()

        const wrapper = document.querySelector(".content-block-editor__wrapper")

        expect(wrapper?.getAttribute("style")).toEqual("height: 400px")
    })

    test("it gets the height of the textarea if a custom height is not specified", () => {
        window.getComputedStyle = vi.fn().mockImplementation(() => {
            return {
                height: "40px",
                fontSize: "20px",
            }
        })

        const contentBlockEditor = new window.ContentBlockEditor(".my-selector")
        contentBlockEditor.initialize()

        const wrapper = document.querySelector(".content-block-editor__wrapper")

        expect(wrapper?.getAttribute("style")).toEqual("height: 40px")
    })
})
