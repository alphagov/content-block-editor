import type { editor, Position, languages } from "monaco-editor";
import { Range } from "monaco-editor/esm/vs/editor/editor.api";
import regex from "../content-block/regex.ts";
import { ContentBlock } from "../content-block/content-block.ts";

const hoverProvider = (
  model: editor.ITextModel,
  position: Position,
): languages.ProviderResult<languages.Hover> => {
  const lineContent = model.getLineContent(position.lineNumber);
  let match;

  while ((match = regex.exec(lineContent)) !== null) {
    const start = match.index + 1;
    const end = start + match[0].length - 1;

    if (position.column >= start && position.column <= end) {
      const blockData = ContentBlock.findByContentId(match[3]);

      if (blockData) {
        const value = match[4]
          ? blockData.digDetails(match[4].split("/"))
          : blockData.title;
        return {
          range: new Range(
            position.lineNumber,
            start,
            position.lineNumber,
            end + 1,
          ),
          contents: [
            { value: `**Content block:** ${blockData.blockType}\n\n${value}` },
          ],
        };
      }
    }
  }

  return null;
};

export default hoverProvider;
