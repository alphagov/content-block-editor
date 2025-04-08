import { ContentBlock } from "../content-block/content-block.ts";
import { PensionDetails } from "../@types";
import { summaryListItemTemplate } from "./summaryListItem.template.ts";

export const summaryCardTemplate = (contentBlock: ContentBlock) => {
  if (contentBlock.schemaName == "content_block_pension") {
    const details = contentBlock.details as PensionDetails;
    return `
            <div class="govuk-summary-card">
              <div class="govuk-summary-card__title-wrapper">
                <h2 class="govuk-summary-card__title">${contentBlock.title}</h2>
              </div>
              <div class="govuk-summary-card__content">
                <dl class="govuk-summary-list">
                  ${Object.keys(details.rates).map((k) => summaryListItemTemplate(contentBlock, k, details.rates[k]))}
                </dl>
              </div>
            </div>
        `;
  }
};
