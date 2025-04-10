import { test, expect } from "@playwright/test";
import config from "../src/config.ts";
import { convertHexToRGB } from "./utils";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Editor Container", () => {
  test("it sets up the editor correctly", async ({ page }) => {
    const editorDiv = page.locator(".monaco-editor");
    await expect(editorDiv).toBeVisible();
  });

  test("it detects and highlights embed codes", async ({ page }) => {
    const monacoEditor = page.locator(".monaco-editor");
    await monacoEditor.click();

    const embedCode =
      "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab}}";

    await page.keyboard.type(embedCode);

    const element = monacoEditor.getByText("{{embed");
    const hexColours = convertHexToRGB(config.embedHighlightColour);

    await expect(element).toHaveCSS(
      "color",
      `rgb(${hexColours.red}, ${hexColours.green}, ${hexColours.blue})`,
    );
  });

  test("it supports embed codes that reference a specific field", async ({
    page,
  }) => {
    const monacoEditor = page.locator(".monaco-editor");
    await monacoEditor.click();

    const embedCode =
      "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab/foo/bar}}";

    await page.keyboard.type(embedCode);

    const element = monacoEditor.getByText("{{embed");
    const hexColours = convertHexToRGB(config.embedHighlightColour);

    await expect(element).toHaveCSS(
      "color",
      `rgb(${hexColours.red}, ${hexColours.green}, ${hexColours.blue})`,
    );
  });

  test("it adds a focus and removes a focus style to the wrapper", async ({
    page,
  }) => {
    const monacoEditor = page.locator(".monaco-editor");
    await monacoEditor.click();

    const wrapper = page.locator(".content-block-editor__wrapper");
    await expect(wrapper).toHaveClass(
      "content-block-editor__wrapper content-block-editor__wrapper--focussed",
    );

    const body = page.locator("h1");
    await body.click();

    await expect(wrapper).toHaveClass("content-block-editor__wrapper");
  });

  test("it ensures the editor is the same height as the textarea", async ({
    page,
  }) => {
    const wrapper = page.locator(".content-block-editor__wrapper");

    await expect(wrapper).toHaveCSS("height", "400px");
  });

  test("it shows information about a block on hover", async ({ page }) => {
    const monacoEditor = page.locator(".monaco-editor");
    await monacoEditor.click();

    const embedCode =
      "{{embed:content_block_pension:bb00b32e-738c-478c-8b18-ddd8f3c62a21}}";

    await page.keyboard.type(embedCode);

    const element = monacoEditor.getByText("{{embed");

    await element.hover();

    await expect(page.getByText("Content Block: Pension")).toBeVisible();
    await expect(
      page.getByRole("paragraph").filter({ hasText: "Some Pension" }),
    ).toBeVisible();
  });

  test("it shows information about a block with a reference on hover", async ({
    page,
  }) => {
    const monacoEditor = page.locator(".monaco-editor");
    await monacoEditor.click();

    const embedCode =
      "{{embed:content_block_pension:bb00b32e-738c-478c-8b18-ddd8f3c62a21/rates/rate-1/amount}}";

    await page.keyboard.type(embedCode);

    const element = monacoEditor.getByText("{{embed");

    await element.hover();

    await expect(page.getByText("Content Block: Pension")).toBeVisible();
    await expect(
      page.getByRole("paragraph").filter({ hasText: "£133.42" }),
    ).toBeVisible();
  });

  test("it shows an error if the embed code is invalid", async ({ page }) => {
    const monacoEditor = page.locator(".monaco-editor");
    await monacoEditor.click();

    const embedCode =
      "{{embed:content_block_pension:d7a92f82-9898-4b35-a641-0e94ee4b1875/rates/rate-1/amount}}";

    await page.keyboard.type(embedCode);

    await page.waitForSelector(".squiggly-error");

    await page.getByText(embedCode).hover();

    await expect(page.getByText("Invalid embed code")).toBeVisible();
  });

  test("it allows a content block to be inserted", async ({ page }) => {
    const monacoEditor = page.locator(".monaco-editor");
    await monacoEditor.click();

    const embedCode =
      "{{embed:content_block_pension:bb00b32e-738c-478c-8b18-ddd8f3c62a21/rates/rate-1/amount}}";

    await page.keyboard.type("Hello, this is an embed code: ");

    await page.getByRole("button", { name: "Insert content block" }).click();

    await page.locator(`[data-embed-code='${embedCode}']`).click();

    await expect(
      page.getByText(`Hello, this is an embed code: ${embedCode}`),
    ).toBeVisible();
  });

  test.describe("with multiple editors", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/two-editors");
    });

    test("it allows content blocks to be inserted in each editor", async ({
      page,
    }) => {
      const locators = ["#editor1", "#editor2"];

      for (const locator of locators) {
        const monacoEditor = page.locator(locator).locator(".monaco-editor");
        await monacoEditor.click();

        const embedCode =
          "{{embed:content_block_pension:bb00b32e-738c-478c-8b18-ddd8f3c62a21/rates/rate-1/amount}}";

        await page.keyboard.type("Hello, this is an embed code: ");

        await page
          .locator(locator)
          .getByRole("button", { name: "Insert content block" })
          .click();

        await page.locator(`[data-embed-code='${embedCode}']`).click();

        await expect(
          page
            .locator(locator)
            .getByText(`Hello, this is an embed code: ${embedCode}`),
        ).toBeVisible();
      }
    });
  });
});
