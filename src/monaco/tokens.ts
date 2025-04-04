import regex from "../content-block/regex.ts";
import type { languages } from "monaco-editor";

export default <languages.IMonarchLanguage>{
  tokenizer: {
    root: [[regex, "embedded"]],
  },
};
