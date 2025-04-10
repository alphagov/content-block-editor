import { beforeEach, describe, test, vi, expect } from "vitest";

import * as template from "./summaryCard.template.ts";
import { ContentBlock } from "../content-block/content-block.ts";
import { createMock } from "@golevelup/ts-vitest";
import { browserTemplate } from "./browser.template.ts";

describe("browserTemplate", () => {
  let wrapper: HTMLDivElement;

  beforeEach(() => {
    wrapper = document.createElement("div");
    window.document.body.append(wrapper);
  });

  test("it adds summary cards for each content block", () => {
    const templateSpy = vi.spyOn(template, "summaryCardTemplate");
    templateSpy.mockReturnValue("HELLO");

    const contentBlocks = [
      createMock<ContentBlock>(),
      createMock<ContentBlock>(),
    ];

    vi.spyOn(ContentBlock, "all").mockReturnValue(contentBlocks);

    wrapper.innerHTML = browserTemplate();

    const result = wrapper.querySelector(
      ".gem-c-modal-dialogue__content",
    ) as HTMLElement;

    expect(result.innerHTML).to.include("Insert content block");
    expect(result.innerHTML).to.include("HELLO");

    expect(templateSpy).toHaveBeenCalledWith(contentBlocks[0]);
    expect(templateSpy).toHaveBeenCalledWith(contentBlocks[1]);
  });
});
