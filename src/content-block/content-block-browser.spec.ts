import { beforeEach, describe, test, vi, expect } from "vitest";
import { ContentBlock } from "./content-block.ts";
import { ContentBlockBrowser } from "./content-block-browser.ts";
import { summaryCardTemplate } from "../templates/summaryCard.template.ts";

describe("ContentBlockBrowser", () => {
  let wrapper: HTMLDivElement;

  const mockContentBlockFinder = vi.fn();

  const rate = {
    title: "rate1",
    amount: "£123",
    frequency: "weekly",
    description: "some description",
  };
  const content_block = new ContentBlock(
    "Some Pension",
    "52037188-8277-4998-a349-7d25ae7f1dff",
    {
      description: "some description",
      rates: {
        rate1: rate,
      },
    },
    "content_block_pension",
  );

  beforeEach(() => {
    ContentBlock.all = mockContentBlockFinder;

    wrapper = document.createElement("div");
    window.document.body.append(wrapper);
  });

  test("adds a modal and summary list to the template", () => {
    mockContentBlockFinder.mockImplementation(() => [content_block]);

    new ContentBlockBrowser(wrapper);

    const browser = document.querySelector(".content-block-browser");
    expect(browser).not.toBeNull;

    const content = browser?.querySelector(
      ".gem-c-modal-dialogue__content",
    ) as HTMLElement;
    expect(content?.querySelector(".govuk-heading-l")?.textContent).toEqual(
      "Insert content block",
    );

    expect(content.querySelectorAll(".govuk-summary-card").length).toEqual(1);
    expect(content.innerHTML).toContain(summaryCardTemplate(content_block));
  });
});
