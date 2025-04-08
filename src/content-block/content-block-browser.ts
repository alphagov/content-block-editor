import { editor } from "monaco-editor/esm/vs/editor/editor.api";

import { ContentBlock } from "./content-block.ts";
import { summaryCardTemplate } from "../templates/summaryCard.template.ts";
import { browserTemplate } from "../templates/browser.template.ts";
import { ModalDialogue } from "../modal-dialogue";

export class ContentBlockBrowser {
  contentBlocks: Array<ContentBlock>;
  wrapper: HTMLDivElement;
  modal: ModalDialogue;

  constructor(
    private readonly module: HTMLElement,
    private readonly editor: editor.IStandaloneCodeEditor,
  ) {
    this.contentBlocks = ContentBlock.all();
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("content-block-browser");
    this.wrapper.innerHTML = browserTemplate;

    this.addSummaryCards();
    this.module.before(this.wrapper);
    this.modal = this.activateModal();
    this.activateInserts();
  }

  addSummaryCards() {
    const dialogueContent = this.wrapper.querySelector(
      ".gem-c-modal-dialogue__content",
    )!;

    this.contentBlocks.forEach((block) => {
      const summaryCard = summaryCardTemplate(block);
      if (summaryCard) {
        dialogueContent.innerHTML += summaryCard;
      }
    });
  }

  activateModal() {
    const modalWrapper = this.wrapper.querySelector(
      '[data-module="modal-dialogue"]',
    ) as HTMLDivElement;
    return new ModalDialogue(modalWrapper);
  }

  activateInserts() {
    const insertLinks = this.wrapper.querySelectorAll(
      "a[data-embed-code]",
    ) as NodeListOf<HTMLAnchorElement>;

    insertLinks.forEach((link) => {
      link.addEventListener("click", this.insertEmbed.bind(this));
    });
  }

  insertEmbed(event: MouseEvent) {
    event.preventDefault();

    const link = event.target as HTMLAnchorElement;
    const text = link.dataset.embedCode!;

    const selection = this.editor.getSelection();
    const id = { major: 1, minor: 1 };
    const op = {
      identifier: id,
      range: {
        startLineNumber: selection?.selectionStartLineNumber || 1,
        startColumn: selection?.selectionStartColumn || 1,
        endLineNumber: selection?.endLineNumber || 1,
        endColumn: selection?.endColumn || 1,
      },
      text,
      forceMoveMarkers: true,
    };
    this.editor.executeEdits("content-block-browser", [op]);
    this.modal.module.close();
  }
}
