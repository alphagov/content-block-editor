import {beforeEach, describe, test,expect} from "vitest";
import * as monaco from "monaco-editor";
import tokens from "./tokens.ts";

describe("Tokens", () => {
    beforeEach(() => {
        monaco.languages.register({ id: "govspeak" });
        monaco.languages.setMonarchTokensProvider("govspeak", tokens)
    })

    test("it tokenises a content block", () => {
        const result = monaco.editor.tokenize("{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab}}", "govspeak")
        const token = result[0][0]

        expect(token.type).toEqual("embedded.govspeak")
    })

    test("it supports content blocks with references", () => {
        const result = monaco.editor.tokenize("{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab/some/reference}}", "govspeak")
        const token = result[0][0]

        expect(token.type).toEqual("embedded.govspeak")
    })
})
