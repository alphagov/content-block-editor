import { describe, test, expect, afterEach } from "vitest";
import regex from "./regex.ts";

describe("regex", () => {
  afterEach(() => {
    regex.lastIndex = 0;
  });

  test("it detects a block without a reference", () => {
    const string =
      "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab}}";
    const result = regex.exec(string);

    expect(result![0]).toEqual(string);
    expect(result![1]).toEqual("embed");
    expect(result![2]).toEqual("content_block_pension");
    expect(result![3]).toEqual("1690ab79-1880-461e-99e4-ed146fd9efab");
    expect(result![4]).toEqual(undefined);
  });

  test("it detects a block with a reference", () => {
    const string =
      "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab/foo/bar}}";
    const result = regex.exec(string);

    expect(result![0]).toEqual(string);
    expect(result![1]).toEqual("embed");
    expect(result![2]).toEqual("content_block_pension");
    expect(result![3]).toEqual("1690ab79-1880-461e-99e4-ed146fd9efab");
    expect(result![4]).toEqual("foo/bar");
  });
});
