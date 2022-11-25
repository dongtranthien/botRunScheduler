const axios = require("axios");
var xl = require("excel4node");
const fs = require("fs");
const FormData = require("form-data");
const {
  PortalUrl,
  PortalServiceUrl,
  IdentifiedTypeImport,
  Token,
} = require("./constant");

async function runApi(str) {
  let payload = {};

  let res = await axios.post(
    `http://urcard-portal-api.urbox.dev/testings/run-${str}`,
    payload
  );

  let data = res.data;
}

const createRandomPublisher = async () => {
  let payload = {
    title: "Test144",
    status: "activated",
    params: {
      emails: [],
      subName: "AB12_EF34",
    },
    contract: {},
    logo: "",
    tags: [],
  };

  let res = await axios.post(
    `${PortalUrl}${PortalServiceUrl.Publisher}`,
    payload,
    {
      headers: {
        Authorization: Token,
      },
    }
  );

  let data = res.data;
  return data;
};

const createCampaign = async (publisherId) => {
  let payload = {
    publisherId,
    title: "Test",
    status: "activated",
    rule: {
      cash_limit: {
        limit: 100000000,
      },
      issue_type: "identified",
      max_balance: "5000000",
      min_payment_amount: "500",
      max_payment_amount: "5000000",
      min_topup_amount: "500",
      payment: {
        offline_at_store: {
          brands: "all",
        },
        online_in_app: {
          brands: "all",
        },
        qr_at_store: {
          brands: "all",
        },
      },
      gift_set_config: null,
    },
    tag: null,
    params: {
      appId: "1",
      appSecret: "ed9e3e8e7444e58f7b6c7fa712255128",
      condition_of_use: {
        vi: "",
        en: "",
      },
      is_testing: false,
      PO: "PO",
    },
  };

  let res = await axios.post(
    `${PortalUrl}${PortalServiceUrl.Campaign}`,
    payload,
    {
      headers: {
        Authorization: Token,
      },
    }
  );

  let data = res.data;
  return data;
};

const createPO = async (publisherId, campaignId) => {
  let payload = {
    amount: 100000000,
    availableAmount: 100000000,
    publisherId: publisherId,
    campaignId: campaignId,
    poDate: new Date(),
    status: "activated",
    allocation: "one",
    notes: {},
  };

  let res = await axios.post(`${PortalUrl}${PortalServiceUrl.Po}`, payload, {
    headers: {
      Authorization: Token,
    },
  });

  let data = res.data;
  return data;
};

const createSubPO = async (poId) => {
  let payload = {
    poId: poId,
    amount: "100000000",
    availableAmount: "100000000",
    status: "activated",
    purchaseProductTypeId: 7,
    discount: {
      type: "amount",
      value: 1,
    },
  };

  let res = await axios.post(`${PortalUrl}${PortalServiceUrl.SubPo}`, payload, {
    headers: {
      Authorization: Token,
    },
  });

  let data = res.data;
  return data;
};

const createCardIssue = async (publisherId, campaignId) => {
  let payload = {
    publisherId,
    campaignId,
    initialQuantity: 5,
    status: "activated",
    designTemplateId: 2,
    expiration: {
      type: "duration",
      duration: "1y",
    },
    initialAmount: 100000,
    initialProducts: [],
    params: {},
    channel: "app",
    serial: null,
    tags: [],
  };

  let res = await axios.post(
    `${PortalUrl}${PortalServiceUrl.CardIssue}`,
    payload,
    {
      headers: {
        Authorization: Token,
      },
    }
  );

  let data = res.data;
  return data;
};

const importXlsx = async (cardIssueId, subPOId, type, code, ranks) => {
  console.log(cardIssueId, subPOId, type, code, ranks);
  // Create xlsx file
  var wb = new xl.Workbook();
  // Add Worksheets to the workbook
  var ws = wb.addWorksheet("Sheet 1");
  if (type === IdentifiedTypeImport.Phone) {
    ws.cell(1, 1).string("Phone");
    ws.cell(2, 1).string(code);
  } else {
    ws.cell(1, 1).string("CIF");
    ws.cell(2, 1).string(code);
    ws.cell(2, 2).string("User Test");
    ws.cell(2, 3).string("1990/01/01");
    ws.cell(2, 4).string("");
    ws.cell(2, 5).string("");
    ws.cell(2, 6).string("");
    ws.cell(2, 7).string(ranks);
    ws.cell(2, 8).string("");
    ws.cell(2, 9).string("");
  }

  wb.write("Excel.xlsx");

  var form = new FormData();
  form.append("isSendSMS", "false");
  form.append("cardIssueId", cardIssueId);
  form.append("subPOId", subPOId);
  form.append("file", fs.createReadStream("Excel.xlsx"));
  console.log(form.getHeaders(), "formData.getHeaders()");

  let res;
  try {
    res = await axios.post(
      `${PortalUrl}${PortalServiceUrl.CardIssueImportCard}`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: Token,
        },
      }
    );
  } catch (error) {
    throw error;
  }

  let data = res?.data;
  console.log(data, "adsf");
  return { data, code, ranks };
};

module.exports = {
  runApi,
  createRandomPublisher,
  createCampaign,
  createPO,
  createSubPO,
  createCardIssue,
  importXlsx,
};
