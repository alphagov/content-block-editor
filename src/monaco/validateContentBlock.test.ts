import {beforeEach, describe, test, vi, expect, afterEach} from "vitest";
import { createMock } from "@golevelup/ts-vitest";
import type { IRange } from "monaco-editor/esm/vs/editor/editor.api";
import { editor } from "monaco-editor/esm/vs/editor/editor.api";
import validateContentBlock from "./validateContentBlock.ts";
import { ContentBlock } from "../content-block/content-block.ts";

describe("validateContentBlock", () => {
  const mockFindByContentId = vi.fn();

  const lines = [
    "The first line with no embeds",
    "The second line with an invalid embed {{embed:content_block_pension:50a52105-b734-4e59-9779-59cb5f777378}}  ",
  ];

  const model = createMock<editor.ITextModel>({
    getLineCount: () => 2,
    getLineLength: (lineNumber) => {
      return lines[lineNumber - 1].length + 1;
    },
    getValueInRange: (range: IRange) => {
      return lines[range.startLineNumber - 1];
    },
  });

  const editorSpy = vi.spyOn(editor, "setModelMarkers");

  beforeEach(() => {
    ContentBlock.findByContentId = mockFindByContentId;
  });

  afterEach(() => {
    editorSpy.mockReset()
  })

  test("it adds errors when a content block is invalid", () => {
    mockFindByContentId.mockImplementation(() => null);

    validateContentBlock(model);

    expect(editorSpy.mock.calls.length).toEqual(1);
    expect(editorSpy.mock.calls[0][0]).toEqual(model);
    expect(editorSpy.mock.calls[0][1]).toEqual("owner");

    const markers = editorSpy.mock.calls[0][2];
    expect(markers.length).toEqual(1)

    expect(markers[0].message).toEqual("Invalid embed code")
    expect(markers[0].startLineNumber).toEqual(2)
    expect(markers[0].endLineNumber).toEqual(2)
    expect(markers[0].startColumn).toEqual(39)
    expect(markers[0].endColumn).toEqual(106)
  });

  test("it does not add errors when a content block is valid", () => {
    mockFindByContentId.mockImplementation(() => createMock<ContentBlock>());

    validateContentBlock(model);

    expect(editorSpy.mock.calls.length).toEqual(1);
    expect(editorSpy.mock.calls[0][0]).toEqual(model);
    expect(editorSpy.mock.calls[0][1]).toEqual("owner");

    const markers = editorSpy.mock.calls[0][2];
    expect(markers.length).toEqual(0)
  });
});
