import { editor, MarkerSeverity } from "monaco-editor/esm/vs/editor/editor.api";
import regex from "../content-block/regex.ts";
import { ContentBlock } from "../content-block/content-block.ts";

const validateContentBlock = (model: editor.ITextModel) => {
  const markers = [];
  const lineCount = model.getLineCount() + 1;
  for (let i = 1; i < lineCount; i++) {
    const range = {
      startLineNumber: i,
      startColumn: 1,
      endLineNumber: i,
      endColumn: model.getLineLength(i) + 1,
    };
    const content = model.getValueInRange(range).trim();
    let match;

    while ((match = regex.exec(content)) !== null) {
      const start = match.index + 1;
      const end = start + match[0].length - 1;
      const blockData = ContentBlock.findByContentId(match[3]);

      if (!blockData) {
        markers.push({
          message: "Invalid embed code",
          severity: MarkerSeverity.Error,
          startLineNumber: range.startLineNumber,
          startColumn: start,
          endLineNumber: range.endLineNumber,
          endColumn: end,
        });
      }
    }
  }
  editor.setModelMarkers(model, "owner", markers);
};

export default validateContentBlock;
