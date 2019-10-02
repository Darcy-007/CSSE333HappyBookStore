var express = require('express');
var router = express.Router();
var config = require('../config').config;
var mssql = require('mssql');
var jwt = require('jsonwebtoken');
var connection = require('../connection').connection;
var secretKey = require('../config').secretKey;

router.route('/insert').post(async (req, res) => {
  console.log("insert an order");
  console.log(req.body);
  var token = req.query.token;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if(err || decoded.userType != "Customer"){
      console.log(err);
    }else {
      username = decoded.username;
      bookid = req.body.BookID;
      OrderType = req.body.OrderType;
      PaymentMethod = req.body.PaymentMethod;
      const connect = await connection;
      const request = await connect.request()
        .input('PaymentMethod', mssql.VarChar(20), PaymentMethod)
        .input('OrderType', mssql.VarChar(20), OrderType)
        .input('Username', mssql.Char(10), username)
        .input('BookID', mssql.VarChar(10), bookid)
        .execute('insert_Order', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            var returnVal = result.returnValue;
            if(returnVal == 0){
              console.log(result);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'order inserted!'});
            }else{
              console.log(result);
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Please fill required entry (entries)!'});
            }
          }
        });
    }});
});

router.route('/process').post(async (req, res) => {
  console.log("process order");
  var token = req.query.token;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if(err || decoded.userType != "Manager"){
      console.log(err);
    }else {
      const connect = await connection;
      const request = await connect.request()
        .input('OrderID', mssql.Int, req.body.OrderID)
        .execute('Process_Order', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            var returnVal = result.returnValue;
            if(returnVal == 0){
              console.log(result);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'process order successfully'});
            }else{
              console.log(result);
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Please fill the order id'});
            }
          }
        });
    }});
});

router.route('/getAllOrders').post(async (req, res) => {
  console.log("get all orders");
  var token = req.query.token;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if(err || decoded.userType != "Manager"){
      console.log(err);
    }else {
      const connect = await connection;
      const request = await connect.request()
        .execute('get_AllOrders', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: "Got Orders", content: result.recordset});
          }
        });
    }});
});

router.route('/get').post((req, res) => {
  console.log("get orders")
    var token = req.query.token;
    jwt.verify(token, secretKey, async (err, decoded) => {
      if(err || decoded.userType != "Customer"){
        console.log(err);
      }else{
        var username = decoded.username;
        const connect = await connection;
        const request = await connect.request()
          .input('Username', mssql.Char(10), username)
          .execute('get_Orders', (err, result) => {
            if(err){
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.json({err: err});
            }else{
              if(result.returnValue == 2){
                res.statusCode = 403;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: "Invalid username"});
              }else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: "Orders fetched", content: result.recordset});
              }
            }
          });
      }
    });
});
module.exports = router;
