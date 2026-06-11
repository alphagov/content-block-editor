import { beforeEach, describe, expect, test, vi } from "vitest";
import { APIClient } from "./api-client";

interface BlockResponse {
  html: string;
}

function createSuccessResponse(data: BlockResponse): Response {
  const json = vi.fn().mockResolvedValue(data);
  return {
    ok: true,
    status: 200,
    json,
  } as unknown as Response;
}

function createErrorResponse(status: number): Response {
  return {
    ok: false,
    status,
    json: vi.fn(),
  } as unknown as Response;
}

describe("APIClient", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  test("it fetches from the encoded block render URL", async () => {
    const baseUrl = "https://example.test";
    const embedCode = "{{embed:contact:abc-123/some path#full}}";
    const expectedPayload: BlockResponse = { html: "<p>Rendered</p>" };
    const expectedUrl = `${baseUrl}/api/blocks/${encodeURIComponent(embedCode)}/render`;
    const client = new APIClient(baseUrl);

    fetchMock.mockResolvedValue(createSuccessResponse(expectedPayload));

    const result = await client.get(embedCode);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(expectedPayload);
  });

  test("it reuses cached requests for the same embed code", async () => {
    const embedCode = "{{embed:contact:abc-123}}";
    const payload: BlockResponse = { html: "<p>Cached</p>" };
    const client = new APIClient();

    fetchMock.mockResolvedValue(createSuccessResponse(payload));

    const firstResult = await client.get(embedCode);
    const secondResult = await client.get(embedCode);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(firstResult).toEqual(payload);
    expect(secondResult).toEqual(payload);
  });

  test("it removes failed requests from cache so retries can succeed", async () => {
    const embedCode = "{{embed:contact:abc-123}}";
    const client = new APIClient();
    const payload: BlockResponse = { html: "<p>Retry worked</p>" };

    fetchMock
      .mockResolvedValueOnce(createErrorResponse(500))
      .mockResolvedValueOnce(createSuccessResponse(payload));

    await expect(client.get(embedCode)).rejects.toThrow(
      "Failed to fetch block {{embed:contact:abc-123}}: 500",
    );

    const result = await client.get(embedCode);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toEqual(payload);
  });

  test("it invalidates a single cached embed", async () => {
    const embedCode = "{{embed:contact:abc-123}}";
    const firstPayload: BlockResponse = { html: "<p>First</p>" };
    const secondPayload: BlockResponse = { html: "<p>Second</p>" };
    const client = new APIClient();

    fetchMock
      .mockResolvedValueOnce(createSuccessResponse(firstPayload))
      .mockResolvedValueOnce(createSuccessResponse(secondPayload));

    await client.get(embedCode);
    client.invalidate(embedCode);
    const result = await client.get(embedCode);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result).toEqual(secondPayload);
  });

  test("it clears all cached embeds", async () => {
    const firstEmbed = "{{embed:contact:abc-123}}";
    const secondEmbed = "{{embed:content_block_tax:def-456}}";
    const client = new APIClient();

    fetchMock
      .mockResolvedValueOnce(createSuccessResponse({ html: "<p>A</p>" }))
      .mockResolvedValueOnce(createSuccessResponse({ html: "<p>B</p>" }))
      .mockResolvedValueOnce(createSuccessResponse({ html: "<p>C</p>" }))
      .mockResolvedValueOnce(createSuccessResponse({ html: "<p>D</p>" }));

    await client.get(firstEmbed);
    await client.get(secondEmbed);
    client.clear();
    await client.get(firstEmbed);
    await client.get(secondEmbed);

    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});
