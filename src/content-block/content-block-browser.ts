import { ContentBlock } from "./content-block.ts";
import { summaryCardTemplate } from "../templates/summaryCard.template.ts";
import { browserTemplate } from "../templates/browser.template.ts";
import { ModalDialogue } from "../modal-dialogue";

export class ContentBlockBrowser {
  contentBlocks: Array<ContentBlock>;
  wrapper: HTMLDivElement;

  constructor(private readonly module: HTMLElement) {
    this.contentBlocks = ContentBlock.all();
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("content-block-browser");
    this.wrapper.innerHTML = browserTemplate;

    this.addSummaryCards();
    this.module.before(this.wrapper);
    this.activateModal();
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
    new ModalDialogue(modalWrapper);
  }
}
