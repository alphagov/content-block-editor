const supportedDocumentTypes = [
  "contact",
  "content_block_pension",
  "content_block_contact",
  "content_block_tax",
  "content_block_time_period",
];

// The regex used to find UUIDs
const uuidRegex =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
// The regex used to find content ID aliases
const contentIdAliasRegex = /[a-z0-9\-–—]+/;
// The regex to find optional field names after the UUID, begins with '/'
const fieldRegex = /(\/[a-z0-9_\-–—/]*)?/;
// The regex used when scanning a document using ContentBlockTools::ContentBlockReference.find_all_in_document
const embedRegex = new RegExp(
  `(\\{\\{embed:(${supportedDocumentTypes.join("|")}):(${uuidRegex.source}|${contentIdAliasRegex.source})${fieldRegex.source}\\}\\})`,
  "g",
);

export default embedRegex;
