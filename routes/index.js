var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run("CREATE TABLE lorem (info TEXT)");

  const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  for (let i = 0; i < 10; i++) {
      stmt.run("Ipsum " + i);
  }
  stmt.finalize();

  db.each("SELECT rowid AS id, info FROM lorem", (err, row) => {
      console.log(row.id + ": " + row.info);
  });
});

db.close();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// console.log(lorem.generateParagraphs(7));

// var paragraphs = [];
// for (var i = 0; i < 7; i++) {
//   paragraphs[i] = lorem.generateParagraphs(1);
// }
//
// var title = lorem.generateSentences(1);

// router.all('*', (req, res) => res.render('random', {title: title, paragraphs: paragraphs} ) )

// router.get('/', (req, res) => res.send(lorem.generateParagraphs(7)))

module.exports = router;
