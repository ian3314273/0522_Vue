var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 使用sqlite3來操作資料庫，開啟位置在db/sqlite.db，開啟時確認是否有連接到資料庫
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('db/sqlite.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the sqlite database.');
});
// 撰寫/api/quotes路由，透過GET方法取得所有的quotes資料
app.get('/api/quotes', (req, res) => {
  db.all('SELECT * FROM movie_quotes', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(rows);
  });
});
// 撰寫post /api/insert路由，透過POST方法新增一筆quote資料(provider, movie_name, quote)，只要回傳文字訊息即可，不要json
app.post('/api/insert', (req, res) => {
  const { provider, movie_name, quote } = req.body;
  db.run('INSERT INTO movie_quotes (provider, movie_name, quote) VALUES (?, ?, ?)', [provider, movie_name, quote], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.send('新增成功');
  });
});
module.exports = app;
