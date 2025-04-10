import { NestedRecord, PensionDetails, RawContentBlockData } from "../@types";

export type PensionContentBlock = ContentBlock & {
  details: PensionDetails;
  schema_name: "content_block_pension";
};

export class ContentBlock {
  constructor(
    readonly title: string,
    readonly contentId: string,
    readonly details: NestedRecord,
    readonly schemaName: string,
  ) {}

  get blockType() {
    return this.schemaName
      .replace("content_block_", "")
      .replace("_", " ")
      .split(" ")
      .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
      .join(" ");
  }

  embedCode = (suffix = ""): string => {
    return `{{embed:${this.schemaName}:${this.contentId}${suffix}}}`;
  };

  digDetails = (keys: Array<string>): string => {
    let value: NestedRecord | string = this.details;
    keys.forEach(function (key) {
      try {
        value = (value as NestedRecord)[key];
      } catch {
        return undefined;
      }
    });

    return value as unknown as string;
  };

  static all(): Array<ContentBlock> {
    if (!window.contentBlocks) {
      const json = JSON.parse(
        window.document.querySelector("#content-blocks")?.textContent || "[]",
      );
      window.contentBlocks = json.map(
        (item: RawContentBlockData) =>
          new ContentBlock(
            item.title,
            item.content_id,
            item.details,
            item.schema_name,
          ),
      );
    }

    return window.contentBlocks || [];
  }

  static findByContentId(contentId: string): ContentBlock | undefined {
    return ContentBlock.all().find((item) => item.contentId == contentId);
  }
}
