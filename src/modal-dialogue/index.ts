export type ModalDialogueModule = {
  open: (this: HTMLElement, ev?: MouseEvent) => void;
  close: (this: HTMLElement, ev?: MouseEvent) => void;
  focusDialog: () => void;
  boundKeyDown: (this: Document, ev: KeyboardEvent) => void;
} & HTMLDivElement;

export class ModalDialogue {
  module: ModalDialogueModule;
  dialogBox: HTMLDialogElement;
  closeButton: HTMLButtonElement;
  html: HTMLHtmlElement;
  body: HTMLBodyElement;
  focusedElementBeforeOpen: HTMLElement | null = null;

  constructor(module: HTMLDivElement) {
    this.module = module as ModalDialogueModule;
    this.dialogBox = this.module.querySelector(".gem-c-modal-dialogue__box")!;
    this.closeButton = this.module.querySelector(
      ".gem-c-modal-dialogue__close-button",
    )!;
    this.html = document.querySelector("html")!;
    this.body = document.querySelector("body")!;

    if (!this.dialogBox || !this.closeButton) return;

    this.module.open = this.handleOpen.bind(this);
    this.module.close = this.handleClose.bind(this);
    this.module.focusDialog = this.handleFocusDialog.bind(this);
    this.module.boundKeyDown = this.handleKeyDown.bind(this);

    const triggerElement = document.querySelector(
      '[data-toggle="modal"][data-target="' + this.module.id + '"]',
    );

    if (triggerElement) {
      (triggerElement as HTMLElement).addEventListener(
        "click",
        this.module.open,
      );
    }

    if (this.closeButton) {
      this.closeButton.addEventListener("click", this.module.close);
    }
  }

  handleOpen(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }

    this.html.classList.add("gem-o-template--modal");
    this.body.classList.add("gem-o-template__body--modal");
    this.body.classList.add("gem-o-template__body--blur");
    this.focusedElementBeforeOpen = document.activeElement as HTMLElement;
    this.module.style.display = "block";
    this.dialogBox.focus();

    document.addEventListener("keydown", this.module.boundKeyDown, true);
  }

  handleClose(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
    }

    this.html.classList.remove("gem-o-template--modal");
    this.body.classList.remove("gem-o-template__body--modal");
    this.body.classList.remove("gem-o-template__body--blur");
    this.module.style.display = "none";
    this.focusedElementBeforeOpen?.focus();

    document.removeEventListener("keydown", this.module.boundKeyDown, true);
  }

  handleFocusDialog() {
    this.dialogBox.focus();
  }

  handleKeyDown(event: KeyboardEvent) {
    const KEY_TAB = 9;
    const KEY_ESC = 27;

    switch (event.keyCode) {
      case KEY_TAB:
        if (event.shiftKey) {
          if (document.activeElement === this.dialogBox) {
            event.preventDefault();
            this.closeButton.focus();
          }
        } else {
          if (document.activeElement === this.closeButton) {
            event.preventDefault();
            this.dialogBox.focus();
          }
        }

        break;
      case KEY_ESC:
        this.module.close();
        break;
      default:
        break;
    }
  }
}
