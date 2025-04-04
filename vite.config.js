import { defineConfig } from "vite";
import { resolve } from "path";
import monacoEditorEsmPlugin from "vite-plugin-monaco-editor-esm";

export default defineConfig({
  plugins: [monacoEditorEsmPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/content-block-editor.ts"),
      name: "Content Block Editor",
      fileName: "content-block-editor",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
  resolve: {
    alias: {
      govuk: resolve(__dirname, "node_modules/govuk-frontend/dist/govuk"),
    },
  },
  test: {
    setupFiles: ["./vitest.setup.ts"],
    environment: "jsdom",
    deps: {
      inline: ["vitest-canvas-mock"],
    },
    threads: false,
    environmentOptions: {
      jsdom: {
        resources: "usable",
      },
    },
    exclude: ["**/node_modules/**", "**/e2e/**"],
    alias: [
      {
        find: /^monaco-editor$/,
        replacement:
          __dirname + "/node_modules/monaco-editor/esm/vs/editor/editor.api",
      },
    ],
  },
});
