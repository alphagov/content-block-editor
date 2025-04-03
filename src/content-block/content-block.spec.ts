import { beforeEach, describe, test, expect } from "vitest";
import { ContentBlock } from "./content-block.ts";

describe("ContentBlock", () => {
  beforeEach(() => {
    window.contentBlocks = undefined;
    window.document.body.innerHTML = `
            <script type="application/json" id="content-blocks">
                [
                    { 
                        "title": "Some title", 
                        "content_id": "0f27814c-ca0c-4a94-921c-13f3382869a4", 
                        "details": {"something": "here" },
                        "schema_name": "content_block_pension"
                    },
                    { 
                        "title": "Another title", 
                        "content_id": "4c33c42e-826b-4d99-a063-c3d40630474d", 
                        "details": {"something": "else" },
                        "schema_name": "content_block_email"
                    }
                ]
            </script>
        `;
  });

  describe("all", () => {
    test("it returns all content blocks", () => {
      const contentBlocks = ContentBlock.all();

      expect(contentBlocks.length).to.eq(2);

      expect(contentBlocks[0]?.title).toEqual("Some title");
      expect(contentBlocks[0]?.contentId).toEqual(
        "0f27814c-ca0c-4a94-921c-13f3382869a4",
      );
      expect(contentBlocks[0]?.details).toEqual({ something: "here" });
      expect(contentBlocks[0]?.schemaName).toEqual("content_block_pension");

      expect(contentBlocks[1]?.title).toEqual("Another title");
      expect(contentBlocks[1]?.contentId).toEqual(
        "4c33c42e-826b-4d99-a063-c3d40630474d",
      );
      expect(contentBlocks[1]?.details).toEqual({ something: "else" });
      expect(contentBlocks[1]?.schemaName).toEqual("content_block_email");
    });

    test("it memoizes the content blocks if they have already been fetched", () => {
      window.contentBlocks = [];
      const contentBlocks = ContentBlock.all();

      expect(contentBlocks.length).to.eq(0);
    });
  });

  describe("findByContentId", () => {
    test("it gets a content block with a particular ID", () => {
      const contentBlock = ContentBlock.findByContentId(
        "4c33c42e-826b-4d99-a063-c3d40630474d",
      );

      expect(contentBlock?.title).toEqual("Another title");
    });

    test("it returns undefined if a block cannot be found", () => {
      const contentBlock = ContentBlock.findByContentId("1234");

      expect(contentBlock).toBeUndefined();
    });
  });

  describe("blockType", () => {
    test("it returns a humanized block type", () => {
      const contentBlock = new ContentBlock(
        "",
        "",
        {},
        "content_block_email_address",
      );

      expect(contentBlock.blockType).toEqual("Email Address");
    });
  });

  describe("digDetails", () => {
    test("it digs through the details object", () => {
      const contentBlock = new ContentBlock(
        "",
        "",
        { foo: { bar: "baz" } },
        "",
      );

      expect(contentBlock.digDetails(["foo", "bar"])).toEqual("baz");
    });

    test("it returns undefined when a key isn't found", () => {
      const contentBlock = new ContentBlock(
        "",
        "",
        { foo: { bar: "baz" } },
        "",
      );

      expect(contentBlock.digDetails(["boo", "bar"])).toEqual(undefined);
    });
  });
});
