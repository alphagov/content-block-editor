import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Content Block Editor", () => {
  const embedCode =
    "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab#some_format}}";
  const previewDelayMs = 200;

  async function hoverTextareaAtMark(page: Page) {
    const textarea = page.locator("textarea.content-block-highlight__input");
    const mark = page
      .locator(".content-block-highlight__highlight")
      .locator("mark.content-block-highlight__mark");

    const markBox = await mark.boundingBox();
    const textareaBox = await textarea.boundingBox();

    if (!markBox || !textareaBox) {
      throw new Error(
        "Expected embed mark and textarea to have a bounding box",
      );
    }

    await textarea.hover({
      position: {
        x: markBox.x - textareaBox.x + Math.min(4, markBox.width / 2),
        y: markBox.y - textareaBox.y + Math.min(4, markBox.height / 2),
      },
    });
  }

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

    await textarea.fill(embedCode);

    const mark = highlight.locator("mark.content-block-highlight__mark");
    await expect(mark).toHaveText(embedCode);
  });

  test("it detects and highlights embed codes with a format specifier", async ({
    page,
  }) => {
    const textarea = page.locator("textarea.content-block-highlight__input");
    const highlight = page.locator(".content-block-highlight__highlight");

    const embedCode =
      "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab#some_format}}";

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

  test("it fetches and shows a preview after hovering an embed for 200ms", async ({
    page,
  }) => {
    const textarea = page.locator("textarea.content-block-highlight__input");
    const preview = page.locator(".content-block-highlight__preview");

    let requestedEmbedCode: string | null = null;
    await page.route("**/api/blocks/render?*", async (route) => {
      const requestUrl = new URL(route.request().url());
      requestedEmbedCode = requestUrl.searchParams.get("embed_codes[]");

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          rendered_blocks: {
            [embedCode]: { html: "<p>Rendered block</p>" },
          },
        }),
      });
    });

    await textarea.fill(embedCode);
    await hoverTextareaAtMark(page);

    await page.waitForTimeout(previewDelayMs - 50);
    await expect(preview).toBeHidden();

    await expect(preview).toContainText("Rendered block", { timeout: 500 });
    expect(requestedEmbedCode).toBe(embedCode);
  });

  test("it does not fetch a preview if hover ends before delay", async ({
    page,
  }) => {
    const textarea = page.locator("textarea.content-block-highlight__input");
    const preview = page.locator(".content-block-highlight__preview");
    const wrapper = page.locator(".content-block-highlight__wrapper");

    let requestCount = 0;
    await page.route("**/api/blocks/render?*", async (route) => {
      requestCount += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ rendered_blocks: {} }),
      });
    });

    await textarea.fill(embedCode);
    await hoverTextareaAtMark(page);
    await page.waitForTimeout(previewDelayMs - 50);

    const wrapperBox = await wrapper.boundingBox();
    if (!wrapperBox) {
      throw new Error("Expected wrapper to have a bounding box");
    }

    await page.mouse.move(
      wrapperBox.x + wrapperBox.width + 20,
      wrapperBox.y + 10,
    );
    await page.waitForTimeout(previewDelayMs + 100);

    expect(requestCount).toBe(0);
    await expect(preview).toBeHidden();
  });
});
