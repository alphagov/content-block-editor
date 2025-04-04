/*!-----------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Version: 0.52.2(404545bded1df6ffa41ea0af4e8ddb219018c6c1)
 * Released under the MIT license
 * https://github.com/microsoft/monaco-editor/blob/main/LICENSE.txt
 *-----------------------------------------------------------------------------*/
var n = (e) => `\\b${e}\\b`, t = "[_a-zA-Z]", o = "[_a-zA-Z0-9]", r = n(`${t}${o}*`), i = [
  "targetScope",
  "resource",
  "module",
  "param",
  "var",
  "output",
  "for",
  "in",
  "if",
  "existing"
], a = ["true", "false", "null"], s = "[ \\t\\r\\n]", c = "[0-9]+", g = {
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "'", close: "'" },
    { open: "'''", close: "'''" }
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: "'''", close: "'''", notIn: ["string", "comment"] }
  ],
  autoCloseBefore: `:.,=}])' 
	`,
  indentationRules: {
    increaseIndentPattern: new RegExp("^((?!\\/\\/).)*(\\{[^}\"'`]*|\\([^)\"'`]*|\\[[^\\]\"'`]*)$"),
    decreaseIndentPattern: new RegExp("^((?!.*?\\/\\*).*\\*/)?\\s*[\\}\\]].*$")
  }
}, l = {
  defaultToken: "",
  tokenPostfix: ".bicep",
  brackets: [
    { open: "{", close: "}", token: "delimiter.curly" },
    { open: "[", close: "]", token: "delimiter.square" },
    { open: "(", close: ")", token: "delimiter.parenthesis" }
  ],
  symbols: /[=><!~?:&|+\-*/^%]+/,
  keywords: i,
  namedLiterals: a,
  escapes: "\\\\(u{[0-9A-Fa-f]+}|n|r|t|\\\\|'|\\${)",
  tokenizer: {
    root: [{ include: "@expression" }, { include: "@whitespace" }],
    stringVerbatim: [
      { regex: "(|'|'')[^']", action: { token: "string" } },
      { regex: "'''", action: { token: "string.quote", next: "@pop" } }
    ],
    stringLiteral: [
      { regex: "\\${", action: { token: "delimiter.bracket", next: "@bracketCounting" } },
      { regex: "[^\\\\'$]+", action: { token: "string" } },
      { regex: "@escapes", action: { token: "string.escape" } },
      { regex: "\\\\.", action: { token: "string.escape.invalid" } },
      { regex: "'", action: { token: "string", next: "@pop" } }
    ],
    bracketCounting: [
      { regex: "{", action: { token: "delimiter.bracket", next: "@bracketCounting" } },
      { regex: "}", action: { token: "delimiter.bracket", next: "@pop" } },
      { include: "expression" }
    ],
    comment: [
      { regex: "[^\\*]+", action: { token: "comment" } },
      { regex: "\\*\\/", action: { token: "comment", next: "@pop" } },
      { regex: "[\\/*]", action: { token: "comment" } }
    ],
    whitespace: [
      { regex: s },
      { regex: "\\/\\*", action: { token: "comment", next: "@comment" } },
      { regex: "\\/\\/.*$", action: { token: "comment" } }
    ],
    expression: [
      { regex: "'''", action: { token: "string.quote", next: "@stringVerbatim" } },
      { regex: "'", action: { token: "string.quote", next: "@stringLiteral" } },
      { regex: c, action: { token: "number" } },
      {
        regex: r,
        action: {
          cases: {
            "@keywords": { token: "keyword" },
            "@namedLiterals": { token: "keyword" },
            "@default": { token: "identifier" }
          }
        }
      }
    ]
  }
};
export {
  g as conf,
  l as language
};
