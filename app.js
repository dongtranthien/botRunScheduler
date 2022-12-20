var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { Telegraf, Markup, Extra } = require("telegraf");
const { Keyboard, Key } = require("telegram-keyboard");
const { uuid } = require("uuidv4");
const portalApi = require("./controller/portal-api/portal-api.js");
const {
  CreatePublisherRandomMsg,
  CreateCampaignMsg,
} = require("./utils/message");
const { RemoveMarkAndSticker } = require("./utils/common");
const { IdentifiedTypeImport } = require("./controller/portal-api/constant");
const database = require("./firebase");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function increaseCounter(type, fromData) {
  const timeNow = new Date().getTime();
  const ref = database.ref(`counter/${type}`);
  const snapshot = await ref.once("value");
  const data = snapshot.val();
  ref.set({
    value:
      data?.value === undefined || data?.value === null || data?.value === NaN
        ? 0
        : data?.value + 1,
  });

  database.ref(`log-${type}/${uuid()}`).set({
    type: type,
    timestamp: timeNow,
    from: fromData,
  });
}

async function getCounter() {
  const ref = database.ref("counter");
  const snapshot = await ref.once("value");
  const data = snapshot.val();
  return data;
}

var indexRouter = require("./routes/index");
// var usersRouter = require('./routes/users');

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const bot = new Telegraf(process.env.botToken);
bot.start((ctx) => ctx.reply("Hello, I'm dev bot~"));
bot.help((ctx) => ctx.reply("Bạn cần mình chạy thưởng hay sinh nhật nè 👍"));
bot.on("sticker", (ctx) => ctx.reply("👍"));
//bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.on("text", async (ctx) => {
  console.log(ctx, "texttext");
  let message = RemoveMarkAndSticker(ctx.update.message.text);

  const idUser = ctx.update.message.from.id;
  const messageArr = message.split(" ");
  if (
    (messageArr.includes("thuong") &&
      !messageArr.includes("ko") &&
      !messageArr.includes("khong") &&
      !messageArr.includes("dung")) ||
    message === "/allowance"
  ) {
    ctx.reply("Mình sẽ chạy thưởng, bạn kiểm tra sau khoảng 1p nhé");
    portalApi.runApi("allowance");
    increaseCounter("allowance", ctx.update.message.from);
  } else if (
    (messageArr.includes("sinh") &&
      messageArr.includes("nhat") &&
      messageArr.indexOf("nhat") - messageArr.indexOf("sinh") === 1 &&
      !messageArr.includes("ko") &&
      !messageArr.includes("khong") &&
      !messageArr.includes("dung")) ||
    message === "/birthday"
  ) {
    ctx.reply("Mình sẽ chạy sinh nhật, bạn kiểm tra sau khoảng 1p nhé");
    portalApi.runApi("birthday");
    increaseCounter("birthday", ctx.update.message.from);
  } else if (message.includes("tong ket") || message.includes("thong ke")) {
    let counter = await getCounter();

    ctx.reply(
      `Bạn đã chạy ${counter.birthday.value} lần sinh nhật và ${counter.allowance.value} lần thưởng`
    );
    ctx.reply("Mình vẫn đang sẵn sàng phục vụ bạn!");
  } else if (message === "/feature") {
    const keyboard = Keyboard.make([
      [Key.callback("Publisher", "publisher")],
      [Key.callback("Campaign", "campaign")],
      [Key.callback("PO", "po")],
      [Key.callback("Card-Issue", "card-issue")],
      [Key.callback("UrStaff", "urstaff")],
    ]);

    //await ctx.reply("Simple built-in keyboard", keyboard.reply());
    ctx.replyWithHTML(
      "<pre>       <b>Urcard Dev Feature</b>   &#x200D;</pre>",
      keyboard.inline()
    );
  } else if (message === "/quick") {
    const keyboard = Keyboard.make([
      [Key.callback("Identified Phone", "quick-identified-phone")],
      [
        Key.callback(
          "Identified partner code Cif",
          "quick-identified-partner-code-cif"
        ),
      ],
    ]);

    //await ctx.reply("Simple built-in keyboard", keyboard.reply());
    ctx.replyWithHTML(
      "<pre><b>Quick Functions of Urcard Dev</b>&#x200D;</pre>",
      keyboard.inline()
    );
  } else if (message[0] === "/") {
    const id = ctx.update.message.from.id;
    const ref = database.ref(`callback/${ctx.update.message.from.id}`);
    const snapshot = await ref.once("value");
    const data = snapshot.val();

    switch (data.type) {
      case "identified-phone-import": {
        const publisher = await portalApi.createRandomPublisher();

        const campaign = await portalApi.createCampaign(publisher.id);

        const po = await portalApi.createPO(publisher.id, campaign.id);

        const subPo = await portalApi.createSubPO(po.id);

        const cardIssue = await portalApi.createCardIssue(
          publisher.id,
          campaign.id
        );

        const phoneNumber = message.substring(1, message.length);
        const result = await portalApi.importXlsx(
          cardIssue.id,
          subPo.id,
          IdentifiedTypeImport.Phone,
          phoneNumber
        );
        console.log(result, "resultresult");

        ctx.replyWithHTML(
          `<b>Create successful - identified phone</b>\n⛵️ Phone number: ${result.code}\n`
        );

        return;
      }
      case "identified-partner-code-cif": {
        const obj = message.substring(1, message.length).split(",");
        let result;
        try {
          result = await portalApi.importXlsx(
            1306,
            542,
            IdentifiedTypeImport.Cif,
            obj[0],
            obj[1]
          );
        } catch (error) {
          ctx.replyWithHTML(
            `<pre><b>Create failed: ${error.response.data.message}</b>&#x200D;</pre>`
          );
          return;
        }

        ctx.replyWithHTML("<pre><b>Create successful</b>&#x200D;</pre>");

        return;
      }
    }

    const keyboard = Keyboard.make([
      [Key.callback("A", "quick-identified-phone")],
    ]);

    //await ctx.reply("Simple built-in keyboard", keyboard.reply());
    ctx.replyWithHTML(
      "<pre><b>Quick Functions of Urcard Dev</b>&#x200D;</pre>",
      keyboard.inline()
    );
  } else {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: message,
      temperature: 0.7,
      max_tokens: 290,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(response.data.choices, "response");
    ctx.reply(response.data.choices[0].text);
  }
});
bot.on("callback_query", async (ctx) => {
  const data = ctx.update.callback_query.data;
  switch (data) {
    case "publisher": {
      ctx.editMessageText(
        "<pre>            <b>Publisher</b>       &#x200D;</pre>",
        {
          ...Markup.inlineKeyboard([
            [Key.callback("Create", "publisher-create-random")],
            [Key.callback("Custom", "publisher-create-custom")],
            [Key.callback("<< Back", "back")],
          ]),
          parse_mode: "HTML",
        }
      );

      break;
    }
    case "publisher-create-random": {
      const publisherValue = await portalApi.createRandomPublisher();
      const { title, code, aliasNumber } = publisherValue;

      ctx.editMessageReplyMarkup({});
      ctx.replyWithMarkdownV2(
        CreatePublisherRandomMsg(title, code, aliasNumber)
      );
      break;
    }
    case "campaign": {
      ctx.editMessageText(
        "<pre>            <b>Campaign</b>        &#x200D;</pre>",
        {
          ...Markup.inlineKeyboard([
            [
              Key.callback(
                "New publisher",
                "campaign-create-with-new-publisher"
              ),
            ],
            [Key.callback("Custom", "campaign-create-custom")],
            [Key.callback("<< Back", "back")],
          ]),
          parse_mode: "HTML",
        }
      );
      break;
    }
    case "campaign-create-with-new-publisher": {
      ctx.editMessageText(
        "<pre> <b>Campaign with new publisher</b>&#x200D;</pre>",
        {
          ...Markup.inlineKeyboard([
            [
              Key.callback(
                "Identified-Phone",
                "campaign-create-new-publisher-identified-phone"
              ),
            ],
            [Key.callback("Custom", "campaign-create-custom")],
            [Key.callback("<< Back", "back")],
          ]),
          parse_mode: "HTML",
        }
      );
      break;
    }
    case "campaign-create-new-publisher-identified-phone": {
      const publisher = await portalApi.createRandomPublisher();

      const campaign = await portalApi.createCampaign(publisher.id);

      const po = await portalApi.createPO(publisher.id, campaign.id);

      const subPo = portalApi.createSubPO(po.id);

      ctx.editMessageText(
        CreateCampaignMsg(
          publisher.title,
          publisher.code,
          publisher.aliasNumber,
          campaign.title,
          campaign.code,
          campaign.status
        ),
        {
          parse_mode: "HTML",
        }
      );
      break;
    }
    case "back": {
      ctx.editMessageText(
        "<pre>       <b>Urcard Dev Feature</b>   &#x200D;</pre>",
        {
          ...Markup.inlineKeyboard([
            [Key.callback("Publisher", "publisher")],
            [Key.callback("Campaign", "campaign")],
            [Key.callback("PO", "po")],
            [Key.callback("Card-Issue", "card-issue")],
            [Key.callback("UrStaff", "urstaff")],
          ]),
          parse_mode: "HTML",
        }
      );
      break;
    }
    case "quick-identified-phone": {
      ctx.editMessageText(
        "<pre><b>Enter your phone number to create(with / before to create) or</b>&#x200D;</pre>",
        {
          ...Markup.inlineKeyboard([
            [
              Key.callback(
                "Create random phone number",
                "quick-identified-phone-random"
              ),
            ],
            [Key.callback("<< Back", "back-quick")],
          ]),
          parse_mode: "HTML",
        }
      );
      const timeNow = new Date().getTime();
      const obj = {};
      obj[timeNow] = {
        data: JSON.stringify(ctx),
      };
      database
        .ref(`callback/${ctx.update.callback_query.from.id}`)
        .set({ time: timeNow, type: "identified-phone-import" });
      break;
    }
    case "quick-identified-partner-code-cif": {
      ctx.editMessageText(
        "<pre><b>Enter your cif to create(with / before to create) or</b>&#x200D;</pre>",
        {
          ...Markup.inlineKeyboard([
            [
              Key.callback(
                "Create random cif",
                "quick-identified-partner-code-cif-random"
              ),
            ],
            [Key.callback("<< Back", "back-quick")],
          ]),
          parse_mode: "HTML",
        }
      );
      const timeNow = new Date().getTime();
      const obj = {};
      obj[timeNow] = {
        data: JSON.stringify(ctx),
      };
      database
        .ref(`callback/${ctx.update.callback_query.from.id}`)
        .set({ time: timeNow, type: "identified-partner-code-cif" });
      break;
    }
    case "quick-identified-partner-code-cif-random": {
      let result;
      try {
        result = await portalApi.importXlsx(
          1306,
          542,
          IdentifiedTypeImport.Cif,
          (new Date().getTime() / 1000).toFixed(),
          "Diamond Elite"
        );
      } catch (error) {
        ctx.replyWithHTML(
          `<pre><b>Create failed: ${error.response.data.message}</b>&#x200D;</pre>`
        );
        return;
      }

      ctx.editMessageText(
        `<b>Create successful - identified cif code</b>\n🛴 Cif: ${result.code}\n🚲Ranks: ${result.ranks}`,
        {
          parse_mode: "HTML",
        }
      );

      break;
    }
    case "back-quick": {
      //await ctx.reply("Simple built-in keyboard", keyboard.reply());
      ctx.editMessageText(
        "<pre><b>Quick Functions of Urcard Dev</b>&#x200D;</pre>",
        {
          ...Markup.inlineKeyboard([
            [Key.callback("Identified Phone", "quick-identified-phone")],
            [
              Key.callback(
                "Identified partner code Cif",
                "quick-identified-partner-code-cif"
              ),
            ],
          ]),
          parse_mode: "HTML",
        }
      );
      break;
    }
    default: {
      ctx.editMessageText(
        "<pre>      <b>Feature is updating..</b> &#x200D;</pre>",
        {
          ...Markup.inlineKeyboard([[Key.callback("<< Back", "back")]]),
          parse_mode: "HTML",
        }
      );
      break;
    }
  }
});

//setInterval(() => { bot.telegram.sendMessage(-634909714, 'hihi') }, 5000);
bot.launch();
//bot.telegram.sendMessage(1739190630, "UrBox Dev");

module.exports = app;
