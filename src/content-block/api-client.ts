/**
 * Represents an embed code response from the API.
 */
export interface EmbedCodePreview {
  html: string;
}

/**
 * APIClient is a simple client for fetching rendered content blocks from the server.
 *
 * It includes an in-memory cache to avoid redundant network requests for the same embed
 * code. The cache is keyed by the embed code string, and the values are Promises that
 * resolve to the fetched data. This allows multiple concurrent requests for the same
 * embed code to share the same Promise, preventing duplicate fetches.
 */

export class APIClient {
  private cache = new Map<string, Promise<EmbedCodePreview>>();
  private readonly baseUrl: string;
  private readonly RENDER_PATH = "/api/blocks/:embedCode/render";

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  async get(embedCode: string): Promise<EmbedCodePreview> {
    if (this.cache.has(embedCode)) {
      return this.cache.get(embedCode)!;
    }

    const url = `${this.baseUrl}${this.RENDER_PATH.replace(":embedCode", encodeURIComponent(embedCode))}`;
    const promise = fetch(url).then(async (response) => {
      if (!response.ok) {
        this.cache.delete(embedCode);
        throw new Error(
          `Failed to fetch block ${embedCode}: ${response.status}`,
        );
      }
      return response.json();
    });

    this.cache.set(embedCode, promise);
    return promise;
  }

  invalidate(embedCode: string): void {
    this.cache.delete(embedCode);
  }

  clear(): void {
    this.cache.clear();
  }
}
