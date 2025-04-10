import { browserTemplate } from "../templates/browser.template.ts";
import { ModalDialogue } from "../modal-dialogue";

export class ContentBlockBrowser {
  wrapper: HTMLDivElement;
  modal: ModalDialogue;

  constructor() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("content-block-browser");
    this.wrapper.innerHTML = browserTemplate();

    window.document.body.append(this.wrapper);
    this.modal = this.activateModal();
    this.activateInserts();
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
    const editor = Object.values(self.editors)[0]

    const selection = editor.getSelection();
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
    editor.executeEdits("content-block-browser", [op]);
    this.modal.module.close();
  }
}
