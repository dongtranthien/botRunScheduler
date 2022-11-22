const PortalUrl = "https://urcard-portal-api.urbox.dev";
const PortalServiceUrl = {
  Publisher: "/publishers",
  Campaign: "/campaigns",
  Po: "/pos",
  SubPo: "/sub-pos",
  CardIssue: "/card-issues",
  CardIssueImportCard: "/card-issues/import-cards",
};

const IdentifiedTypeImport = {
  Phone: "phone",
  Cif: "cif",
};

module.exports = { PortalUrl, PortalServiceUrl, IdentifiedTypeImport };
