import type { editor } from "monaco-editor";

import config from "../config.ts";

export default <editor.IStandaloneThemeData>{
  base: "vs",
  inherit: true,
  rules: [
    {
      token: "embedded",
      foreground: config.embedHighlightColour,
    },
  ],
  colors: {
    "editor.foreground": "#000000",
    "editor.lineHighlightBorder": "#fff",
  },
};
