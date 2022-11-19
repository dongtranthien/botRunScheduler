const CreatePublisherRandomMsg = (title, code, aliasNumber) => {
  return `
    *Publisher has created*
    
    👽 *Title*: ${title}
    🛸 *Code*: ${code}
    🛰 *AliasNumber*: ${aliasNumber}
    `;
};

const CreateCampaignMsg = (
  publisherTitle,
  publisherCode,
  publisherAliasNumber,
  campaignTitle,
  campaignCode,
  campaignStatus
) => {
  return `
    <pre>     <b>Campaign has created\</b>     &#x200D;</pre>
    <b>Publisher\</b>
    <a>👽 Title: ${publisherTitle}\</a>
    <a>🛸 Code: ${publisherCode}\</a>
    <a>🛰 Alias Number: ${publisherAliasNumber}\</a>
    <b>Campaign\</b>
    <a>🚁 Title: ${campaignTitle}\</a>
    <a>🏎 Code: ${campaignCode}\</a>
    <a>🚂 Status: ${campaignStatus}\</a>
    `;
};

module.exports = { CreatePublisherRandomMsg, CreateCampaignMsg };
