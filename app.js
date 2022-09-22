var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Telegraf } = require('telegraf');
const axios = require('axios');
// Import the functions you need from the SDKs you need
const firebaseAdmin = require('firebase-admin');
const { uuid } = require('uuidv4');
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
  databaseURL: process.env.databaseURL,
  credential: firebaseAdmin.credential.cert(JSON.parse(process.env.serviceAccount)),
};
firebaseAdmin.initializeApp(firebaseConfig)

let database = firebaseAdmin.database()
async function increaseCounter(type) {
  const timeNow = new Date().getTime();
  const ref = database.ref(`counter/${type}`);
  const snapshot = await ref.once('value');
  const data = snapshot.val();
  ref.set({
    value: data?.value === undefined || data?.value === null || data?.value === NaN ? 0 : data?.value + 1
  })

  database.ref(`log-${type}/${uuid()}`).set({
    type: type,
    timestamp: timeNow

  })

}

async function getCounter() {
  const ref = database.ref('counter');
  const snapshot = await ref.once('value');
  const data = snapshot.val();
  console.log(data)
}

async function runApi(str) {

  let payload = {};

  let res = await axios.post(`http://urcard-portal-api.urbox.dev/testings/run-${str}`, payload);

  let data = res.data;
  console.log(data);
}

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const bot = new Telegraf(process.env.botToken);
const groupId = -634909714;
//bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Bạn cần mình chạy thưởng hay sinh nhật nè 👍'));
//bot.on('sticker', (ctx) => ctx.reply('👍'));
//bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.on("text", async (ctx) => {
  let message = ctx.update.message.text;
  console.log(ctx.update.message, 'ctx.update.message')
  // remove mark text
  message = message.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // remove sticker
  message = message.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
  console.log(ctx.update.message, 'ctx.update.message')
  const idUser = ctx.update.message.from.id;
  const messageArr = message.split(' ');
  if (messageArr.includes('thuong')
    && !messageArr.includes('ko') && !messageArr.includes('khong')
    && !messageArr.includes('dung')) {
    ctx.reply("Mình sẽ chạy thưởng, bạn kiểm tra sau khoảng 1p nhé");
    await runApi('allowance');
    await increaseCounter('allowance');
  }
  else if (messageArr.includes('sinh')
    && messageArr.includes('nhat')
    && (messageArr.indexOf('nhat') - messageArr.indexOf('sinh') === 1)
    && !messageArr.includes('ko') && !messageArr.includes('khong')
    && !messageArr.includes('dung')) {
    ctx.reply("Mình sẽ chạy sinh nhật, bạn kiểm tra sau khoảng 1p nhé");
    await runApi('birthday');
    await increaseCounter('birthday');
  }
  else if (message.includes('tong ket')) {
    let counter = await getCounter();
    ctx.telegram.sendMessage(`Bạn đã chạy ${counter.birthday.value} lần sinh nhật và ${counter.allowance.value} lần thưởng`)

    ctx.reply('Mình vẫn đang sẵn sàng phục vụ bạn!');
  }
  else {
    ctx.reply("Bạn đang cần gì? Bạn cần chạy sinh nhật hoặc thưởng ko, mình sẽ giúp bạn 👍");
  }
});
//setInterval(() => { bot.telegram.sendMessage(-634909714, 'hihi') }, 5000);
bot.launch();

module.exports = app;
