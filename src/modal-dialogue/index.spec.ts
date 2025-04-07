import { beforeEach, describe, test, expect } from "vitest";
import { ModalDialogue, ModalDialogueModule } from "./index.ts";

describe("ModalDialogue", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("div");
    container.innerHTML =
      '<button class="govuk-button" data-toggle="modal" data-target="my-modal">Launch modal dialogue</button>' +
      '<div class="gem-c-modal-dialogue" data-module="modal-dialogue" id="my-modal">' +
      '<dialog class="gem-c-modal-dialogue__box" aria-modal="true" role="dialogue" aria-labelledby="my-modal-title">' +
      '<div class="gem-c-modal-dialogue__container">' +
      '<div class="gem-c-modal-dialogue__content">' +
      '<h2 id="my-modal-title">Modal title</h2>' +
      "</div>" +
      '<button class="gem-c-modal-dialogue__close-button" aria-label="Close modal dialogue">&times;</button>' +
      "</div>" +
      "</dialog>" +
      '<div class="gem-c-modal-dialogue__overlay"></div>' +
      "</div>" +
      document.body.appendChild(container);
    const element = document.querySelector(
      '[data-module="modal-dialogue"]',
    ) as HTMLDivElement;

    new ModalDialogue(element);
  });

  describe("open button", () => {
    beforeEach(function () {
      (document.querySelector(".govuk-button") as HTMLButtonElement).click();
    });

    test("it should show the modal dialogue", function () {
      const modal = document.querySelector(".gem-c-modal-dialogue");
      expect(modal?.getAttribute("style")).to.eq("display: block;");
    });
  });

  describe("esc key", function () {
    test("it should close the modal", function () {
      const modal = document.querySelector(
        ".gem-c-modal-dialogue",
      ) as ModalDialogueModule;
      modal.open();

      const event = new KeyboardEvent("keydown", {
        key: "27",
        keyCode: 27,
      });
      modal.dispatchEvent(event);
      expect(modal?.getAttribute("style")).to.eq("display: none;");
    });
  });

  describe("close button", function () {
    test("it should hide the modal dialogue", function () {
      const button = document.querySelector(
        ".govuk-button",
      ) as HTMLButtonElement;
      button.dispatchEvent(new window.Event("focus"));
      button.click();

      const closeButton = document.querySelector(
        ".gem-c-modal-dialogue__close-button",
      ) as HTMLButtonElement;

      const modal = document.querySelector(".gem-c-modal-dialogue");
      closeButton.click();

      expect(modal?.getAttribute("style")).to.eq("display: none;");
    });
  });
});
