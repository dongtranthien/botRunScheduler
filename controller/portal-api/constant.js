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

const Token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VyIjp7ImlkIjo5MzU0LCJlbWFpbCI6InRhbi5udEB1cmJveC52biJ9LCJwYXJ0bmVyVG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGVIQWlPakUyTnpZNE9USTJNVGNzSW1saGRDSTZNVFkyT1RFeE5qWXhOeXdpY0dGeWRHNWxjbDlwWkNJNk1UTXNJbkp2YkdWZmFXUWlPakl6T1Rnc0luVnpaWEpmYVdRaU9qa3pOVFI5LkZvRzFuVGRWazZLQkRURHd4VnR5Mmd1UlVOU2lGcFVILWxyNkhCemhXQmNSZGdNNF9QT1ptdVJrVV92MWxJYWxvVGc4cmJlTXExRXNFaWZxaS11Y1NqczhFRzMwVHhNSG53cmNJdTVsNmJKNHNJNnc5cjBKLWx0bi00N0RpQ21PVEtlUHhyTDJ1bzhPR1otaGNiUUV0NWtMVGpnUm42YjBuaVFyU2lSc3duTSIsImlhdCI6MTY2OTExNjYxNywiZXhwIjoxNjY5NzIxNDE3LCJpc3MiOiJmZWF0aGVycyIsImp0aSI6ImE0YTM4YTc1LTFjYjEtNDRiMS1hZmRhLWY1MjkxYzM4N2ZlOSJ9.XSu9imCcdTmFHVg3Q40Yg05e00SSP0jP_-9WtUHNHqc";

module.exports = { PortalUrl, PortalServiceUrl, IdentifiedTypeImport, Token };
