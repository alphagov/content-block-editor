import regex from "../content-block/regex.ts"
import * as monaco from "monaco-editor";

export default <monaco.languages.IMonarchLanguage>{
    tokenizer: {
        root: [
            [regex, 'embedded']
        ]
    }
}
