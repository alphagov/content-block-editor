const openBrackets = "{{";
const colon = ":";
const closeBrackets = "}}";
const embed = "(embed)";
const blockTypes = "(content_block_pension|content_block_email)";
const uuid =
  "([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\\/?([a-z0-9_\\-\\/]*)";
const regex = new RegExp(
  `${openBrackets}${embed}${colon}${blockTypes}${colon}${uuid}?${closeBrackets}`,
  "g",
);

export default regex;
