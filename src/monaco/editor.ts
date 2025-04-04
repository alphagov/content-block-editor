import 'monaco-editor/esm/vs/editor/contrib/hover/browser/hoverContribution.js';

import { languages, editor } from "monaco-editor/esm/vs/editor/editor.api";
import tokens from "./tokens.ts";
import theme from "./theme.ts";
import hoverProvider from "./hoverProvider.ts";
import variables from "../variables.module.scss";

const themeName = "content-block-editor";
const languageId = "govspeak";

const registerDefaults = () => {
  languages.register({ id: languageId });
  languages.setMonarchTokensProvider(languageId, tokens);
  languages.registerHoverProvider(languageId, {
    provideHover: hoverProvider,
  });
  editor.defineTheme(themeName, theme);
};

const createEditor = (
  container: HTMLElement,
  textarea: HTMLTextAreaElement,
): editor.IStandaloneCodeEditor => {
  registerDefaults();

  const monacoEditor = editor.create(container, {
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

  monacoEditor.onDidChangeModelContent(() => {
    textarea.value = <string>monacoEditor?.getValue();
  });

  monacoEditor.onDidFocusEditorText(() => {
    container.classList.add("content-block-editor__wrapper--focussed");
  });

  monacoEditor.onDidBlurEditorText(() => {
    container.classList.remove("content-block-editor__wrapper--focussed");
  });

  return monacoEditor;
};

export { createEditor };
