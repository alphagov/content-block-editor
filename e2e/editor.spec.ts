import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test.describe("Editor Container", () => {
    test("it sets up the editor correctly", async ({ page }) => {
        const editorDiv = page.locator(".monaco-editor");
        await expect(editorDiv).toBeVisible();
    })
})
