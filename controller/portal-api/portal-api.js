const axios = require("axios");
const { PortalUrl, PortalServiceUrl } = require("./constant");

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
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VyIjp7ImlkIjo5MzU0LCJlbWFpbCI6InRhbi5udEB1cmJveC52biJ9LCJwYXJ0bmVyVG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGVIQWlPakUyTnpZME16UXpNemNzSW1saGRDSTZNVFkyT0RZMU9ETXpOeXdpY0dGeWRHNWxjbDlwWkNJNk1UTXNJbkp2YkdWZmFXUWlPakl6T1Rnc0luVnpaWEpmYVdRaU9qa3pOVFI5LkpkWTcxdTZSUzhVckttWHg2RW9ybWwwdWpvVVk3OVZZMnNJaDQ2dk1jNl9OSWI2UFJveGN6XzJzb29TWENPbWxpVWc3b0FBQW9HT3NZWVJZdXVZOE5NSmNsSUZOc185WHJXcWlBZ19yenJEUXF3V3VIdXJNTk93bHl4V2czZmcxaDIzaS1FTS1nUVAtck5saVpaU2ZlSmJoMWxWUFRWRnlHbXlBUGJxcW1mdyIsImlhdCI6MTY2ODY1ODMzNywiZXhwIjoxNjY5MjYzMTM3LCJpc3MiOiJmZWF0aGVycyIsImp0aSI6ImUxNDNjMjc0LWYyMWEtNGY1NS05NzcyLWFkNmNiYzk1ZmE5YyJ9.qh0QGO35DGfFrW7F--z4GKXYppMbmTdcj81bJDNqTf0",
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
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VyIjp7ImlkIjo5MzU0LCJlbWFpbCI6InRhbi5udEB1cmJveC52biJ9LCJwYXJ0bmVyVG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGVIQWlPakUyTnpZME16UXpNemNzSW1saGRDSTZNVFkyT0RZMU9ETXpOeXdpY0dGeWRHNWxjbDlwWkNJNk1UTXNJbkp2YkdWZmFXUWlPakl6T1Rnc0luVnpaWEpmYVdRaU9qa3pOVFI5LkpkWTcxdTZSUzhVckttWHg2RW9ybWwwdWpvVVk3OVZZMnNJaDQ2dk1jNl9OSWI2UFJveGN6XzJzb29TWENPbWxpVWc3b0FBQW9HT3NZWVJZdXVZOE5NSmNsSUZOc185WHJXcWlBZ19yenJEUXF3V3VIdXJNTk93bHl4V2czZmcxaDIzaS1FTS1nUVAtck5saVpaU2ZlSmJoMWxWUFRWRnlHbXlBUGJxcW1mdyIsImlhdCI6MTY2ODY1ODMzNywiZXhwIjoxNjY5MjYzMTM3LCJpc3MiOiJmZWF0aGVycyIsImp0aSI6ImUxNDNjMjc0LWYyMWEtNGY1NS05NzcyLWFkNmNiYzk1ZmE5YyJ9.qh0QGO35DGfFrW7F--z4GKXYppMbmTdcj81bJDNqTf0",
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
    publisherId: 1,
    campaignId: 827,
    poDate: new Date(),
    status: "activated",
    allocation: "one",
    notes: {},
  };

  let res = await axios.post(`${PortalUrl}${PortalServiceUrl.Po}`, payload, {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VyIjp7ImlkIjo5MzU0LCJlbWFpbCI6InRhbi5udEB1cmJveC52biJ9LCJwYXJ0bmVyVG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGVIQWlPakUyTnpZME16UXpNemNzSW1saGRDSTZNVFkyT0RZMU9ETXpOeXdpY0dGeWRHNWxjbDlwWkNJNk1UTXNJbkp2YkdWZmFXUWlPakl6T1Rnc0luVnpaWEpmYVdRaU9qa3pOVFI5LkpkWTcxdTZSUzhVckttWHg2RW9ybWwwdWpvVVk3OVZZMnNJaDQ2dk1jNl9OSWI2UFJveGN6XzJzb29TWENPbWxpVWc3b0FBQW9HT3NZWVJZdXVZOE5NSmNsSUZOc185WHJXcWlBZ19yenJEUXF3V3VIdXJNTk93bHl4V2czZmcxaDIzaS1FTS1nUVAtck5saVpaU2ZlSmJoMWxWUFRWRnlHbXlBUGJxcW1mdyIsImlhdCI6MTY2ODY1ODMzNywiZXhwIjoxNjY5MjYzMTM3LCJpc3MiOiJmZWF0aGVycyIsImp0aSI6ImUxNDNjMjc0LWYyMWEtNGY1NS05NzcyLWFkNmNiYzk1ZmE5YyJ9.qh0QGO35DGfFrW7F--z4GKXYppMbmTdcj81bJDNqTf0",
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
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJ1c2VyIjp7ImlkIjo5MzU0LCJlbWFpbCI6InRhbi5udEB1cmJveC52biJ9LCJwYXJ0bmVyVG9rZW4iOiJleUpoYkdjaU9pSlNVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGVIQWlPakUyTnpZME16UXpNemNzSW1saGRDSTZNVFkyT0RZMU9ETXpOeXdpY0dGeWRHNWxjbDlwWkNJNk1UTXNJbkp2YkdWZmFXUWlPakl6T1Rnc0luVnpaWEpmYVdRaU9qa3pOVFI5LkpkWTcxdTZSUzhVckttWHg2RW9ybWwwdWpvVVk3OVZZMnNJaDQ2dk1jNl9OSWI2UFJveGN6XzJzb29TWENPbWxpVWc3b0FBQW9HT3NZWVJZdXVZOE5NSmNsSUZOc185WHJXcWlBZ19yenJEUXF3V3VIdXJNTk93bHl4V2czZmcxaDIzaS1FTS1nUVAtck5saVpaU2ZlSmJoMWxWUFRWRnlHbXlBUGJxcW1mdyIsImlhdCI6MTY2ODY1ODMzNywiZXhwIjoxNjY5MjYzMTM3LCJpc3MiOiJmZWF0aGVycyIsImp0aSI6ImUxNDNjMjc0LWYyMWEtNGY1NS05NzcyLWFkNmNiYzk1ZmE5YyJ9.qh0QGO35DGfFrW7F--z4GKXYppMbmTdcj81bJDNqTf0",
    },
  });

  let data = res.data;
  return data;
};

module.exports = {
  createRandomPublisher,
  createCampaign,
  createPO,
  createSubPO,
};
