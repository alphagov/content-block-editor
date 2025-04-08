import {
  afterEach,
  beforeEach,
  describe,
  test,
  vi,
  expect,
  MockedClass,
} from "vitest";
import { createMock } from "@golevelup/ts-vitest";
import type { editor, Selection } from "monaco-editor/esm/vs/editor/editor.api";
import { ContentBlock } from "./content-block.ts";
import { ContentBlockBrowser } from "./content-block-browser.ts";
import { summaryCardTemplate } from "../templates/summaryCard.template.ts";
import { ModalDialogue, ModalDialogueModule } from "../modal-dialogue";

vi.mock("../modal-dialogue");

describe("ContentBlockBrowser", () => {
  let wrapper: HTMLDivElement;

  const mockContentBlockFinder = vi.fn();
  const MockModalDialogue = ModalDialogue as MockedClass<typeof ModalDialogue>;
  const mockModule = createMock<ModalDialogueModule>({
    close: vi.fn(),
  });

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

  const selection = createMock<Selection>({
    selectionStartLineNumber: 4,
    selectionStartColumn: 2,
    endLineNumber: 4,
    endColumn: 2,
  });
  const editor = createMock<editor.IStandaloneCodeEditor>({
    getSelection: () => selection,
    executeEdits: vi.fn(),
  });

  const executeEditsSpy = vi.spyOn(editor, "executeEdits");
  const moduleCloseSpy = vi.spyOn(mockModule, "close");

  beforeEach(() => {
    ContentBlock.all = mockContentBlockFinder;
    mockContentBlockFinder.mockImplementation(() => [content_block]);

    wrapper = document.createElement("div");
    window.document.body.append(wrapper);

    MockModalDialogue.prototype.module = mockModule;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("adds a modal and summary list to the template", () => {
    new ContentBlockBrowser(wrapper, editor);

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

  test("it executes edits on the editor when a block is clicked", () => {
    new ContentBlockBrowser(wrapper, editor);

    const embedLink = document.querySelector("a[data-embed-code]")!;
    embedLink.dispatchEvent(new window.Event("click"));

    expect(executeEditsSpy.mock.calls.length).toEqual(1);

    const call = executeEditsSpy.mock.calls[0];

    expect(call[0]).toEqual("content-block-browser");
    expect(call[1][0].identifier).toEqual({ major: 1, minor: 1 });
    expect(call[1][0].range).toEqual({
      startLineNumber: 4,
      startColumn: 2,
      endLineNumber: 4,
      endColumn: 2,
    });
    expect(call[1][0].text).toEqual(
      "{{embed:content_block_pension:52037188-8277-4998-a349-7d25ae7f1dff/rates/rate1/amount}}",
    );
  });

  test("it closes the modal after inserting a block", () => {
    new ContentBlockBrowser(wrapper, editor);

    const embedLink = document.querySelector("a[data-embed-code]")!;
    embedLink.dispatchEvent(new window.Event("click"));

    expect(ModalDialogue).toHaveBeenCalled();
    expect(moduleCloseSpy.mock.calls.length).toEqual(1);
  });
});
