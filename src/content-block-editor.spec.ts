import { expect, test, describe, beforeEach, vi } from "vitest";
import { ContentBlockEditor } from "./content-block-editor.ts";

describe("ContentBlockEditor", () => {
  let textarea: HTMLTextAreaElement;
  let editor: ContentBlockEditor;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="container">
        <textarea id="my-textarea" data-module="content-block-highlight"></textarea>
      </div>
    `;
    textarea = document.getElementById("my-textarea") as HTMLTextAreaElement;
    editor = new ContentBlockEditor(textarea);
  });

  describe("initializeModule", () => {
    test("it returns the element if it is a textarea", () => {
      expect(editor.initializeModule(textarea)).toBe(textarea);
    });

    test("it throws an error if the element is not a textarea", () => {
      const div = document.createElement("div");
      div.innerHTML = "Not a textarea";
      const editorMock = Object.create(ContentBlockEditor.prototype);
      expect(() => editorMock.initializeModule(div)).toThrow(
        /is not a textarea/,
      );
    });
  });

  describe("createWrapper", () => {
    test("it creates a wrapper div and moves the textarea inside it", () => {
      const wrapper = editor.wrapper;

      expect(wrapper.className).toBe("content-block-highlight__wrapper");
      expect(textarea.parentNode).toBe(wrapper);
      expect(document.getElementById("container")?.firstElementChild).toBe(
        wrapper,
      );
    });
  });

  describe("createHighlight", () => {
    test("it creates a highlight div inside the wrapper", () => {
      const highlight = editor.highlight;

      expect(highlight.className).toContain(
        "content-block-highlight__highlight",
      );
      expect(highlight.getAttribute("aria-hidden")).toBe("true");
      expect(editor.wrapper.contains(highlight)).toBe(true);
    });
  });

  describe("updateHighlight", () => {
    test("it escapes HTML and wraps embed codes", () => {
      editor.textarea = textarea;
      editor.highlight = document.createElement("div");

      textarea.value = "<b>{{embed:contact:123}}</b>";
      editor.updateHighlight();

      expect(editor.highlight.innerHTML).toBe(
        '&lt;b&gt;<mark class="content-block-highlight__mark">{{embed:contact:123}}</mark>&lt;/b&gt;',
      );
    });

    test("it adds a trailing space if the text ends with a newline", () => {
      editor.textarea = textarea;
      editor.highlight = document.createElement("div");

      textarea.value = "text\n";
      editor.updateHighlight();

      expect(editor.highlight.innerHTML).toBe("text\n ");
    });
  });

  describe("constructor & events", () => {
    test("the constructor initializes everything correctly", () => {
      const editorInstance = new ContentBlockEditor(textarea);

      expect(editorInstance.textarea).toBe(textarea);
      expect(
        editorInstance.wrapper.classList.contains(
          "content-block-highlight__wrapper",
        ),
      ).toBe(true);
      expect(
        editorInstance.highlight.classList.contains(
          "content-block-highlight__highlight",
        ),
      ).toBe(true);
      expect(
        textarea.classList.contains("content-block-highlight__input"),
      ).toBe(true);
    });

    test("it updates the highlight on input", () => {
      new ContentBlockEditor(textarea);
      textarea.value = "{{embed:contact:123}}";
      textarea.dispatchEvent(new Event("input"));

      const highlight = document.querySelector(
        ".content-block-highlight__highlight",
      );
      expect(highlight?.innerHTML).toContain("<mark");
    });

    test("it syncs scroll positions", () => {
      const editorInstance = new ContentBlockEditor(textarea);
      textarea.scrollTop = 50;
      textarea.scrollLeft = 20;
      textarea.dispatchEvent(new Event("scroll"));

      expect(editorInstance.highlight.scrollTop).toBe(50);
      expect(editorInstance.highlight.scrollLeft).toBe(20);
    });

    test("it initializes ResizeObserver to sync scroll on resize", () => {
      const observeSpy = vi.spyOn(ResizeObserver.prototype, "observe");
      new ContentBlockEditor(textarea);

      expect(observeSpy).toHaveBeenCalledWith(textarea);
    });
  });

  describe("initAll", () => {
    test("it initializes multiple instances based on data-module", () => {
      document.body.innerHTML = `
        <textarea data-module="content-block-highlight"></textarea>
        <textarea data-module="content-block-highlight"></textarea>
      `;
      const editors = ContentBlockEditor.initAll();
      expect(editors.length).toBe(2);
      expect(editors[0]).toBeInstanceOf(ContentBlockEditor);
    });

    test("it initializes given a data module with multiple values", () => {
      document.body.innerHTML = `
        <textarea data-module="content-block-highlight some-other-module"></textarea>
      `;
      const editors = ContentBlockEditor.initAll();
      expect(editors.length).toBe(1);
      expect(editors[0]).toBeInstanceOf(ContentBlockEditor);
    });
  });

  describe("embed hover preview", () => {
    test("it fetches and renders preview HTML after 200ms of hover", async () => {
      const embedCode =
        "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab#some_format}}";
      textarea.value = embedCode;
      editor.updateHighlight();

      const mark = editor.highlight.querySelector(
        ".content-block-highlight__mark",
      ) as HTMLElement;
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          rendered_blocks: {
            [embedCode]: { html: "<p>Rendered block</p>" },
          },
        }),
      });

      vi.stubGlobal("fetch", fetchMock);
      Object.defineProperty(document, "elementsFromPoint", {
        configurable: true,
        writable: true,
        value: vi.fn().mockReturnValue([textarea, mark]),
      });

      editor.wrapper.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 1,
          clientY: 1,
        }),
      );

      await vi.advanceTimersByTimeAsync(150);
      expect(fetchMock).not.toHaveBeenCalled();

      await vi.advanceTimersByTimeAsync(50);

      const [calledUrl] = fetchMock.mock.calls[0] as [string];
      const parsedUrl = new URL(calledUrl, "http://localhost");
      expect(parsedUrl.pathname).toBe("/api/blocks/render");
      expect(parsedUrl.searchParams.get("embed_codes[]")).toBe(embedCode);
      expect(editor.preview.hidden).toBe(false);
      expect(editor.preview.innerHTML).toContain("Rendered block");
    });

    test("it cancels preview fetch when hover ends before delay", async () => {
      textarea.value =
        "{{embed:content_block_pension:1690ab79-1880-461e-99e4-ed146fd9efab}}";
      editor.updateHighlight();

      const mark = editor.highlight.querySelector(
        ".content-block-highlight__mark",
      ) as HTMLElement;
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        text: async () => "<p>Rendered block</p>",
      });

      vi.stubGlobal("fetch", fetchMock);
      Object.defineProperty(document, "elementsFromPoint", {
        configurable: true,
        writable: true,
        value: vi.fn().mockReturnValue([textarea, mark]),
      });

      editor.wrapper.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 1,
          clientY: 1,
        }),
      );

      editor.wrapper.dispatchEvent(
        new MouseEvent("mouseleave", { bubbles: true }),
      );
      await vi.advanceTimersByTimeAsync(300);

      expect(fetchMock).not.toHaveBeenCalled();
      expect(editor.preview.hidden).toBe(true);
    });

    test("it hides stale preview immediately when hovering a different embed", () => {
      const firstEmbed = "{{embed:contact:123}}";
      const secondEmbed = "{{embed:contact:456}}";

      textarea.value = `${firstEmbed} ${secondEmbed}`;
      editor.updateHighlight();

      const marks = editor.highlight.querySelectorAll(
        ".content-block-highlight__mark",
      );
      const secondMark = marks[1] as HTMLElement;

      editor.currentEmbedCodePreview = firstEmbed;
      editor.preview.hidden = false;
      editor.preview.innerHTML = "<p>Old preview</p>";

      Object.defineProperty(document, "elementsFromPoint", {
        configurable: true,
        writable: true,
        value: vi.fn().mockReturnValue([textarea, secondMark]),
      });

      editor.wrapper.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 1,
          clientY: 1,
        }),
      );

      expect(editor.preview.hidden).toBe(true);
      expect(editor.preview.innerHTML).toBe("");
      expect(editor.currentEmbedCodePreview).toBe(secondEmbed);
    });
  });
});

describe("ContentBlockEditor - Preview Fetching and Rendering", () => {
  let textarea: HTMLTextAreaElement;
  let editor: ContentBlockEditor;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="container">
        <textarea id="my-textarea" data-module="content-block-highlight"></textarea>
      </div>
    `;
    textarea = document.getElementById("my-textarea") as HTMLTextAreaElement;
    editor = new ContentBlockEditor(textarea);
  });

  describe("positionPreview", () => {
    test("it positions the preview relative to the mark and wrapper", () => {
      const mark = document.createElement("mark");
      // Mock getBoundingClientRect for mark and wrapper
      vi.spyOn(mark, "getBoundingClientRect").mockReturnValue({
        top: 100,
        bottom: 120,
        left: 50,
        right: 150,
        width: 100,
        height: 20,
        x: 50,
        y: 100,
      } as DOMRect);

      vi.spyOn(editor.wrapper, "getBoundingClientRect").mockReturnValue({
        top: 10,
        bottom: 500,
        left: 10,
        right: 610,
        width: 600,
        height: 490,
        x: 10,
        y: 10,
      } as DOMRect);

      editor.positionPreview(mark);

      expect(editor.preview.style.left).toBe("40px"); // 50 - 10
      expect(editor.preview.style.top).toBe("118px"); // 120 - 10 + 8
    });
  });

  describe("fetchAndRenderPreview", () => {
    const embedCode = "{{embed:contact:123}}";
    let mark: HTMLElement;

    beforeEach(() => {
      mark = document.createElement("mark");
      mark.className = "content-block-highlight__mark";
      mark.textContent = embedCode;
      editor.highlight.appendChild(mark);
      editor.currentEmbedCodePreview = embedCode;

      // Mock getBoundingClientRect for positionPreview
      vi.spyOn(mark, "getBoundingClientRect").mockReturnValue({
        top: 100,
        bottom: 120,
        left: 50,
        right: 150,
      } as DOMRect);
      vi.spyOn(editor.wrapper, "getBoundingClientRect").mockReturnValue({
        top: 10,
        left: 10,
      } as DOMRect);
    });

    test("it renders HTML on successful fetch", async () => {
      const mockHtml = "<div>Contact Details</div>";
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          rendered_blocks: {
            [embedCode]: { html: mockHtml },
          },
        }),
      });
      vi.stubGlobal("fetch", fetchMock);

      await editor.fetchAndRenderPreview(embedCode, mark);

      const [calledUrl] = fetchMock.mock.calls[0] as [string];
      const parsedUrl = new URL(calledUrl, "http://localhost");
      expect(parsedUrl.pathname).toBe("/api/blocks/render");
      expect(parsedUrl.searchParams.get("embed_codes[]")).toBe(embedCode);
      expect(editor.preview.innerHTML).toBe(mockHtml);
      expect(editor.preview.hidden).toBe(false);
    });

    test("it hides preview if response is not ok", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
      });
      vi.stubGlobal("fetch", fetchMock);

      editor.preview.hidden = false;
      editor.preview.innerHTML = "previous content";

      await editor.fetchAndRenderPreview(embedCode, mark);

      expect(editor.preview.hidden).toBe(true);
      expect(editor.preview.innerHTML).toBe("");
    });

    test("it hides preview if JSON is missing expected data", async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          rendered_blocks: {}, // missing our embedCode
        }),
      });
      vi.stubGlobal("fetch", fetchMock);

      editor.preview.hidden = false;
      await editor.fetchAndRenderPreview(embedCode, mark);

      expect(editor.preview.hidden).toBe(true);
    });

    test("it hides preview if fetch throws an error", async () => {
      const fetchMock = vi.fn().mockRejectedValue(new Error("Network failure"));
      vi.stubGlobal("fetch", fetchMock);

      editor.preview.hidden = false;
      await editor.fetchAndRenderPreview(embedCode, mark);

      expect(editor.preview.hidden).toBe(true);
    });

    test("it does not render if hoveredEmbedCode changed during fetch", async () => {
      const mockHtml = "<div>Contact Details</div>";
      type MockFetchResponse = {
        ok: boolean;
        json: () => Promise<{
          rendered_blocks: Record<string, { html: string }>;
        }>;
      };
      let resolveFetch: (value: MockFetchResponse) => void;
      const fetchPromise = new Promise<MockFetchResponse>((resolve) => {
        resolveFetch = resolve;
      });

      const fetchMock = vi.fn().mockReturnValue(fetchPromise);
      vi.stubGlobal("fetch", fetchMock);

      const callPromise = editor.fetchAndRenderPreview(embedCode, mark);

      // Change hovered embed code while fetch is pending
      editor.currentEmbedCodePreview = "{{embed:other:456}}";

      resolveFetch!({
        ok: true,
        json: async () => ({
          rendered_blocks: {
            [embedCode]: { html: mockHtml },
          },
        }),
      });

      await callPromise;

      expect(editor.preview.innerHTML).toBe("");
      expect(editor.preview.hidden).toBe(true);
    });
  });

  describe("hidePreview", () => {
    test("hidePreview clears content and hides element", () => {
      editor.preview.innerHTML = "some content";
      editor.preview.hidden = false;

      editor.hidePreview();

      expect(editor.preview.innerHTML).toBe("");
      expect(editor.preview.hidden).toBe(true);
    });
  });

  describe("resetHoverState", () => {
    test("resetHoverState clears timer and hovered code", () => {
      const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
      editor.hoverTimerId = 123;
      editor.currentEmbedCodePreview = "code";

      editor.resetHoverState();

      expect(clearTimeoutSpy).toHaveBeenCalledWith(123);
      expect(editor.hoverTimerId).toBeNull();
      expect(editor.currentEmbedCodePreview).toBeNull();
      expect(editor.preview.hidden).toBe(true);
    });

    test("handleMouseMove does not reset hover state when no mark is hovered and state is already idle", () => {
      const resetHoverStateSpy = vi.spyOn(editor, "resetHoverState");

      Object.defineProperty(document, "elementsFromPoint", {
        configurable: true,
        writable: true,
        value: vi.fn().mockReturnValue([textarea]),
      });

      editor.wrapper.dispatchEvent(
        new MouseEvent("mousemove", {
          bubbles: true,
          clientX: 1,
          clientY: 1,
        }),
      );

      expect(resetHoverStateSpy).not.toHaveBeenCalled();
    });
  });
});
