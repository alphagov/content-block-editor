import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Content Block Editor", () => {
  test("it makes the highlighter visible", async ({ page }) => {
    const wrapper = page.locator(".content-block-highlight__wrapper");
    const textarea = page.locator("textarea.content-block-highlight__input");
    const highlight = page.locator(".content-block-highlight__highlight");

    await expect(wrapper).toBeVisible();
    await expect(textarea).toBeVisible();
    await expect(highlight).toBeVisible();
  });

  test("it detects and highlights embed codes", async ({ page }) => {
    const textarea = page.locator("textarea.content-block-highlight__input");
    const highlight = page.locator(".content-block-highlight__highlight");

    const embedCode =
      "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab}}";

    await textarea.fill(embedCode);

    const mark = highlight.locator("mark.content-block-highlight__mark");
    await expect(mark).toHaveText(embedCode);
  });

  test("it syncs scrolling between textarea and highlight div", async ({
    page,
  }) => {
    const textarea = page.locator("textarea.content-block-highlight__input");
    const highlight = page.locator(".content-block-highlight__highlight");

    // Add enough content to make it scrollable
    const longContent = "Line\n".repeat(50) + "{{embed:contact:123}}";
    await textarea.fill(longContent);

    // Scroll the textarea
    await textarea.evaluate((el) => {
      el.scrollTop = 100;
    });

    // Wait a moment for any observers/events
    await page.waitForTimeout(100);

    // Check if highlight div scrolled to the same position
    const scrollTop = await highlight.evaluate((el) => el.scrollTop);
    expect(scrollTop).toBe(100);
  });

  test("it escapes HTML in the highlight overlay", async ({ page }) => {
    const textarea = page.locator("textarea.content-block-highlight__input");
    const highlight = page.locator(".content-block-highlight__highlight");

    const unsafeText = "<b>Bold</b> {{embed:contact:123}}";
    await textarea.fill(unsafeText);

    // The highlighter should escape < and >
    const html = await highlight.innerHTML();
    expect(html).toContain("&lt;b&gt;Bold&lt;/b&gt;");
    expect(html).toContain('<mark class="content-block-highlight__mark">');
  });
});
