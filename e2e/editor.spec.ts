import { test, expect } from "@playwright/test";
import config from "../src/config.ts";
import {convertHexToRGB} from "./utils";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test.describe("Editor Container", () => {
    test("it sets up the editor correctly", async ({ page }) => {
        const editorDiv = page.locator(".monaco-editor");
        await expect(editorDiv).toBeVisible();
    })

    test("it detects and highlights embed codes", async ({page}) => {
        const monacoEditor = page.locator(".monaco-editor")
        await monacoEditor.click();

        const embedCode = "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab}}"

        await page.keyboard.type(embedCode);

        const element = monacoEditor.getByText("{{embed")
        const hexColours = convertHexToRGB(config.embedHighlightColour)

        await expect(element).toHaveCSS('color', `rgb(${hexColours.red}, ${hexColours.green}, ${hexColours.blue})`)
    })

    test("it supports embed codes that reference a specific field", async ({page}) => {
        const monacoEditor = page.locator(".monaco-editor")
        await monacoEditor.click();

        const embedCode = "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab/foo/bar}}"
        
        await page.keyboard.type(embedCode);

        const element = monacoEditor.getByText("{{embed")
        const hexColours = convertHexToRGB(config.embedHighlightColour)

        await expect(element).toHaveCSS('color', `rgb(${hexColours.red}, ${hexColours.green}, ${hexColours.blue})`)
    })

    test("it adds a focus and removes a focus style to the wrapper", async ({page}) => {
        const monacoEditor = page.locator(".monaco-editor")
        await monacoEditor.click();

        const wrapper = page.locator(".content-block-editor__wrapper")
        await expect(wrapper).toHaveClass("content-block-editor__wrapper content-block-editor__wrapper--focussed")

        const body = page.locator("h1")
        await body.click();

        await expect(wrapper).toHaveClass("content-block-editor__wrapper")
    })
})
