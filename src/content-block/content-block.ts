import { RawContentBlockData } from "../@types";

export class ContentBlock {
  constructor(
    readonly title: string,
    readonly contentId: string,
    readonly details: Record<string, unknown>,
    readonly schemaName: string,
  ) {}

  static all(): Array<ContentBlock> {
    if (!window.contentBlocks) {
      const json = JSON.parse(
        window.document.querySelector("#content-blocks")?.textContent || "",
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
