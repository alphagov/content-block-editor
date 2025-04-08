import { ContentBlock } from "../content-block/content-block.ts";
import { PensionRate } from "../@types";

export const summaryListItemTemplate = (
  contentBlock: ContentBlock,
  key: string,
  rate: PensionRate,
) => {
  return `
    <div class="govuk-summary-list__row">
      <dt class="govuk-summary-list__key">
        ${rate.title}
      </dt>
      <dd class="govuk-summary-list__value">
        ${rate.amount}
      </dd>
      <dd class="govuk-summary-list__actions">
        <a class="govuk-link" href="#" data-embed-code="${contentBlock.embedCode(`/rates/${key}/amount`)}">Insert<span class="govuk-visually-hidden">${rate.title}</span></a>
      </dd>
    </div>`;
};
