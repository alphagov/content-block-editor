import * as monaco from "monaco-editor";

import config from "../config.ts";

export default <monaco.editor.IStandaloneThemeData>{
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
    },
}
