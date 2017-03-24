const express = require('express');
const router = express.Router();
const path = require('path');
const muter = require('multer');
const upload = muter({dest: 'uploads/'});
const fs = require('fs');
const mysql = require('../mysql');
const crypto = require('crypto');


router.get('/news', (req, res)=> {
  mysql.query('select * from news  order by id desc ', [], (err, data)=> {
    if (!err) {
      res.json(data);
    }
  });
});

router.post('/upload', upload.single('file'), (req, res)=> {
  res.end('ok');
});

// router.post('/auth', (req, res)=> {
//   mysql.query('select * from admin_user where hash = ?'
//     , [req.cookies.hash], function (err, result) {
//       if (result.length === 0) {
//         res.json({
//           code: '404',
//           info: 'not right'
//         });
//       } else {
//         req.session.auth = true;
//       }
//     });
// });

// router.post('/check', (req, res)=> {
//   var hash = crypto.createHash('md5').update(req.body.password).digest('hex');
//   mysql.query('select * from admin_user where account = ?'
//     , [req.body.userName], function (err, result) {
//       if (result.length === 0) {
//         res.json({
//           code: '404',
//           info: 'account not exist'
//         });
//       } else {
//         if (result[0].password === hash) {
//           req.session.auth = true;
//           if (req.body.remember) {
//             res.cookie('hash', result[0].hash, {path: '/', expires: new Date(Date.now() + 900000)})
//           }
//           res.json({
//             code: '200',
//             info: 'ok'
//           });
//         } else {
//           res.json({
//             code: '404',
//             info: 'password not right'
//           });
//         }
//       }
//     });
// });
module.exports = router;
