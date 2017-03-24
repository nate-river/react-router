const express = require('express');
const app = express();

////////////////////////////////////
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});

////////////////////////////////////
// var compression = require('compression');
// app.use(compression());

////////////////////////////////////
var cookieParser = require('cookie-parser');
app.use(cookieParser());

///////////////
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

////////////////////////////////////
const session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));


//-------------------------------------------------------
const mysql = require('./mysql');
const crypto = require('crypto');
app.get('/auth', (req, res)=> {
  mysql.query('select * from admin_user where hash = ?'
    , [req.cookies.hash], function (err, result) {
      if (result.length === 0) {
        res.json({
          code: '404',
          info: 'not right'
        });
      } else {
        req.session.auth = true;
        res.json({
          code: '200',
          info: 'ok'
        })
      }
    });
});
app.post('/check', (req, res)=> {
  var hash = crypto.createHash('md5').update(req.body.password).digest('hex');
  mysql.query('select * from admin_user where account = ?', [req.body.userName], function (err, result) {
    if (result.length === 0) {
      res.json({
        code: '404',
        info: 'account not exist'
      });
    } else {
      if (result[0].password === hash) {
        req.session.auth = true;
        if (req.body.remember) {
          res.cookie('hash', result[0].hash, {path: '/', expires: new Date(Date.now() + 900000)})
        }
        res.json({
          code: '200',
          info: 'ok'
        });
      } else {
        res.json({
          code: '404',
          info: 'password not right'
        });
      }
    }
  });
});

///////////////////////////////////////////////
const apiRouter = require('./api/api');
const auth = (req, res, next)=> {
  if (req.session.auth) {
    next()
  } else {
    res.json({
      code: '404',
      info: 'not auth'
    })
  }
};
app.use('/api', auth, apiRouter);

app.listen(8000, ()=> {
  console.log('server is listening http://localhost:8000');
});
process.on('uncaughtException', (exception)=> {
  console.log(exception.message);
});