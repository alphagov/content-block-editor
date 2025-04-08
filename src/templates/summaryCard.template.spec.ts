import { describe, test, expect, beforeEach } from "vitest";
import { ContentBlock } from "../content-block/content-block.ts";
import { summaryCardTemplate } from "./summaryCard.template.ts";

describe("summaryCardTemplate", () => {
  let wrapper: HTMLDivElement;

  beforeEach(() => {
    wrapper = document.createElement("div");
    window.document.body.append(wrapper);
  });

  test("it generates a summary card for a pension content block", () => {
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

    wrapper.innerHTML = summaryCardTemplate(content_block) || "";

    const result = wrapper.querySelector(".govuk-summary-card")!;

    expect(
      result.querySelector(".govuk-summary-card__title")?.textContent,
    ).toEqual(content_block.title);

    const listItems = wrapper.querySelectorAll(
      ".govuk-summary-list .govuk-summary-list__row",
    );

    expect(listItems.length).toEqual(1);

    expect(
      listItems[0]
        .querySelector(".govuk-summary-list__key")
        ?.textContent?.trim(),
    ).toEqual(rate.title);

    expect(
      listItems[0]
        .querySelector(".govuk-summary-list__value")
        ?.textContent?.trim(),
    ).toEqual(rate.amount);

    expect(
      (listItems[0].querySelector(".govuk-link") as HTMLElement)?.dataset
        ?.embedCode,
    ).toEqual(
      "{{embed:content_block_pension:52037188-8277-4998-a349-7d25ae7f1dff/rates/rate1/amount}}",
    );
  });

  test("it returns undefined when a content block is not a pension", () => {
    const content_block = new ContentBlock(
      "Some email",
      "52037188-8277-4998-a349-7d25ae7f1dff",
      {},
      "content_block_email_address",
    );

    expect(summaryCardTemplate(content_block)).toBeUndefined();
  });
});
