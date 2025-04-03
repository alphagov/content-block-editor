import * as monaco from "monaco-editor";
import tokens from "./tokens.ts";
import theme from "./theme.ts";
import variables from "../variables.module.scss";

const themeName = "content-block-editor";
const languageId = "govspeak";

const registerDefaults = () => {
  monaco.languages.register({ id: languageId });
  monaco.languages.setMonarchTokensProvider(languageId, tokens);
  monaco.editor.defineTheme(themeName, theme);
};

const createEditor = (
  container: HTMLElement,
  textarea: HTMLTextAreaElement,
): monaco.editor.IStandaloneCodeEditor => {
  registerDefaults();

  const editor = monaco.editor.create(container, {
    value: textarea.value,
    language: languageId,
    minimap: { enabled: false },
    lineNumbers: "off",
    fontFamily: variables.fontFamily,
    fontSize: 19,
    glyphMargin: false,
    folding: false,
    lineDecorationsWidth: 5,
    lineNumbersMinChars: 0,
    theme: themeName,
    padding: {
      top: 5,
      bottom: 5,
    },
    wordWrap: "on",
  });

  editor.onDidChangeModelContent(() => {
    textarea.value = <string>editor?.getValue();
  });

  editor.onDidFocusEditorText(() => {
    container.classList.add("content-block-editor__wrapper--focussed");
  });

  editor.onDidBlurEditorText(() => {
    container.classList.remove("content-block-editor__wrapper--focussed");
  });

  return editor;
};

export { createEditor };
