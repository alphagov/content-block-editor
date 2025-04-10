# Content Block Editor

A prototype using [Monaco Editor](https://microsoft.github.io/monaco-editor/) to demonstrate how we could highlight content blocks within publishing apps.

## Local development

1. Clone the repo
1. Install dependencies:

   ```bash
   npm install
   ```

1. Run the development server:

   ```bash
   npm run dev
   ```

1. Access the [Example editor](http://localhost:5173/)
1. Run tests

   ### Unit tests

   ```bash
   npm run test
   ```

   ### E2E tests (using [Playwright](https://playwright.dev/))

   ```bash
   npm run e2e-test
   ```

## Overview

The editor can be used as a "drop-in" replacement for textareas, allowing Content Block embed codes from
[Content Block Manager](https://docs.publishing.service.gov.uk/repos/whitehall/content_block_manager.html) to be
highlighted, and (in future) provide contextual information about the blocks.

Currently, all that the application does is highlight blocks like so:

![Preview](docs/img/preview.png)

In future, we'd like to:

- [ ] Add contextual information (using [`registerInlayHintsProvider`](https://microsoft.github.io/monaco-editor/typedoc/functions/languages.registerInlayHintsProvider.html))
- [x] Add information about a block on hover (using [`registerHoverProvider`](https://microsoft.github.io/monaco-editor/typedoc/functions/languages.registerHoverProvider.html))
- [x] Highlight invalid / not found blocks
- [ ] Add autocompletion (using [`registerCompletionItemProvider`](https://microsoft.github.io/monaco-editor/typedoc/functions/languages.registerCompletionItemProvider.html))

Additionally, we can quite easily provide Markdown highlighting using [see the Markdown example here](https://microsoft.github.io/monaco-editor/monarch.html),
but we need to test the basic principle with users first.

A (very rough) prototype containing much of these features can be found in the [Prototype directory](./prototype). The
most interesting stuff can be found in the [monaco.js file](./prototype/js/monaco.js)

## Demo

You can see a [demo of the work so far here](https://alphagov.github.io/content-block-editor/)
