import { beforeEach, describe, vi, test, expect, afterEach } from "vitest";
import { createMock } from "@golevelup/ts-vitest";
import * as monaco from "monaco-editor";
import hoverProvider from "./hoverProvider.ts";
import { ContentBlock } from "../content-block/content-block.ts";
import regex from "../content-block/regex.ts";

describe("hoverProvider", () => {
  let lineContent: string;

  const model = createMock<monaco.editor.ITextModel>({
    getLineContent: () => lineContent,
  });

  const position = createMock<monaco.Position>({
    lineNumber: 1,
    column: 2,
  });

  const mockFindByContentId = vi.fn();
  const mockContentBlock = new ContentBlock(
    "My content block",
    "",
    { foo: { bar: "baz" } },
    "content_block_something",
  );

  beforeEach(() => {
    ContentBlock.findByContentId = mockFindByContentId;
    mockFindByContentId.mockImplementation(() => mockContentBlock);
  });

  afterEach(() => {
    regex.lastIndex = 0;
  });

  test("it returns a result when a content block is found", async () => {
    lineContent =
      "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab}}";

    const result = await hoverProvider(model, position);
    const range = result!.range!;
    const contents = result!.contents!;

    expect(range.startLineNumber).toEqual(1);
    expect(range.startColumn).toEqual(1);
    expect(range.endLineNumber).toEqual(1);
    expect(range.endColumn).toEqual(lineContent.length + 1);

    expect(contents.length).toEqual(1);
    expect(contents[0]).toEqual({
      value: "**Content block:** Something\n\nMy content block",
    });
  });

  test("it returns the value of an item in the details hash if a reference is provided", async () => {
    lineContent =
      "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab/foo/bar}}";
    const result = await hoverProvider(model, position);

    const contents = result!.contents!;
    expect(contents.length).toEqual(1);
    expect(contents[0]).toEqual({
      value: "**Content block:** Something\n\nbaz",
    });
  });

  test("it returns null when a match is not found", async () => {
    lineContent = "something else";
    const result = await hoverProvider(model, position);

    expect(result).toBeNull();
  });

  test("it returns null if the column number is after the end of the match", async () => {
    const embedCode =
      "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab/foo/bar}}";
    lineContent = `${embedCode} something else`;

    const position = createMock<monaco.Position>({
      lineNumber: 1,
      column: embedCode.length + 2,
    });

    const result = await hoverProvider(model, position);

    expect(result).toBeNull();
  });
});
