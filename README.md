# Content Block Editor

A lightweight, drop-in textarea highlighter for highlighting content blocks within publishing apps.

## Local development

1. Clone the repo
1. Install dependencies:

   ```bash
   yarn install
   ```

1. Run the development server:

   ```bash
   yarn run dev
   ```

1. Access the [Example editor](http://localhost:5173/)
1. Run tests

   ### Unit tests

   ```bash
   yarn run test
   ```

   ### E2E tests (using [Playwright](https://playwright.dev/))

   ```bash
   yarn run e2e-test
   ```

## Overview

The editor can be used as a "drop-in" replacement for textareas, allowing Content Block embed codes from
[Content Block Manager](https://docs.publishing.service.gov.uk/repos/whitehall/content_block_manager.html) to be
highlighted.

It works by overlaying a transparent textarea on top of a styled `<div>` that contains the highlighted content. This ensures that standard textarea behaviour is maintained while providing visual highlighting.

### Usage

To initialise the editor on a textarea, add the `data-module="content-block-highlight"` attribute:

```html
<textarea data-module="content-block-highlight"></textarea>
```

Then initialise the Javascript:

```javascript
import { ContentBlockEditor } from "content-block-editor";

ContentBlockEditor.initAll();
```

## Demo

You can see a [demo of the work so far here](https://alphagov.github.io/content-block-editor/)

## Future work

In future, we'd like to provide previews of the content blocks when the user hovers over an embed code.
