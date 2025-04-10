import { ContentBlockEditor } from "../content-block-editor.ts";
import { ContentBlock } from "../content-block/content-block.ts";
import type { editor } from "monaco-editor/esm/vs/editor/editor.api";
import { ContentBlockBrowser } from "../content-block/content-block-browser.ts";

export type NestedRecord = { [k: string]: string | NestedRecord };

export type RawContentBlockData = Record<string, unknown> & {
  title: string;
  content_id: string;
  details: NestedRecord;
  schema_name: string;
};

export type PensionRate = {
  title: string;
  amount: string;
  frequency: string;
  description: string;
};

export type PensionDetails = {
  description: string;
  rates: Record<string, PensionRate>;
};

declare global {
  interface Window {
    ContentBlockEditor: typeof ContentBlockEditor;
    contentBlocks: Array<ContentBlock> | undefined;
    contentBlockBrowser: ContentBlockBrowser;
    editors: Record<string, editor.IStandaloneCodeEditor>;
  }
}
