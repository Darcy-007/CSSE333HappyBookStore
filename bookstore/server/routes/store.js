var express = require('express');
var router = express.Router();
var config = require('../config').config;
var mssql = require('mssql');
var jwt = require('jsonwebtoken');
var connection = require('../connection').connection;
var secretKey = require('../config').secretKey;

router.route('/get').post((req, res) => {
  console.log("get a store");
  var token = req.query.token;
  jwt.verify(token, secretKey, async(err, decoded) => {
    if(err){
      console.log(err);
    }else{
      const connect = await connection;
      const request = await connect.request()
      .input('StoreID', mssql.VarChar(10), req.body.storeid)
      .execute('get_Store', (err, result) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        } else {
          var returnVal = result.returnValue;
          if (returnVal == 3) {
            console.log(result);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: false, status: 'Please fill out the Store ID' });
          } else if (returnVal == 2) {
            console.log(result);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: false, status: 'Incorrect StoreID' });
          } else if (returnVal == 0){
            console.log(result);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'yeah!', content: result.recordset[0]});
          } else {
            console.log(result);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: false, status: 'errrrror' });
          }
        }
      });
    }
  })
});
router.route('/getAll').post((req, res) => {
  console.log("Fetching all the stores...");
  var token = req.query.token;
  jwt.verify(token, secretKey, async(err, decoded) => {
    if(err){
      console.log(err);
    }else{
      const connect = await connection;
      const request = await connect.request()
      .execute('get_AllStores', (err, result) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({ err: err });
        } else {
          if (result.returnValue == 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Stores fetched!', content: result.recordset});

          } else {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: false, status: 'Fail to fetch stores' });
          }
        }
      })
    }
  });
});




module.exports = router;
