var express = require('express');
var router = express.Router();
var config = require('../config').config;
var secretKey = require('../config').secretKey;
var connection = require('../connection').connection;
var wif = require('wif');
var jwt = require('jsonwebtoken');
var mssql = require('mssql');

function encode(data) {
  var key = new Buffer(data);
  return wif.encode(128, key, true);
}

/* GET users listing. */
router.route('/login').post(async (req, res) => {
  console.log("Prepare to login...");
  const connect = await connection;
  const request = await connect.request()
  .input('Username', mssql.Char(10), req.body.username)
  .input('Password', mssql.VarChar(50), encode(req.body.password))
  .execute('customer_login', (err, result) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }else{
      var returnVal = result.returnValue;
      if(returnVal == 0){
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        var token = jwt.sign({username: req.body.username, userType: "Customer"},
          secretKey, {expiresIn: 20 * 60});
        res.json({success: true, status: 'Login Succeeded!',token : token, userType : "Customer"});
      }else{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Failed!'});
      }
    }
  });
});


router.route('/register').post(async (req, res, next) => {
    console.log("Prepare to register...");
  const connect = await connection;
  const request = await connect.request()
    .input('Username', mssql.Char(10), req.body.username)
    .input('Password', mssql.VarChar(50), encode(req.body.password))
    .input('Email', mssql.Char(30), req.body.email)
    .input('Lastname', mssql.Char(10), req.body.lastname)
    .input('Firstname', mssql.Char(10), req.body.firstname)
    .input('Phone', mssql.Char(11), req.body.phone)
    .execute('insert_Customer', (err, result) => {
      if(err){
        console.log(err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }else{
        var returnVal = result.returnValue;
        if(returnVal == 3){
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Missing Input!'});
        }else if(returnVal == 2){
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'The username is already in use!'});
        }else if(returnVal == 1){
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'The email is already in use!'});
        }else if(returnVal == 0){
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Register Succeeded!'});
        }else{
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Register Failed!'});
        }
      }
   });
});
router.route('/updateCustomer').post( (req, res, next) => {
  console.log("Prepare to updateOtherStuff...");
  var token = req.query.token;
  jwt.verify(token, secretKey, async(err, decoded) => {
    if (err || decoded.userType != "Customer") {
      console.log(err);
    }else{
      const connect = await connection;
      const request = await connect.request()
        .input('Username', mssql.Char(10), decoded.username)
        .input('Lastname', mssql.Char(10), req.body.Lastname)
        .input('Firstname', mssql.Char(10), req.body.Firstname)
        .input('Email', mssql.Char(30), req.body.Email)
        .input('Phone', mssql.Char(11), req.body.Phone)
        .execute('update_Customer', (err, result) => {
          if(err){
            console.log(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            var returnVal = result.returnValue;
            if(returnVal == 2){
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Missing Input!'});
            }else if(returnVal == 1){
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'The username does not exist!'});
            }else{
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Update Succeeded!'});
            }
          }
        });
    }
  });

});
router.route('/updatePassword').post((req, res, next) => {
  console.log("Prepare to updatePassword...");
  console.log(req.query);
  var token = req.query.token;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if(err || decoded.userType != "Customer"){
      console.log(err);
    }else{
      var uname = decoded.username;
      const connect = await connection;
      const request = await connect.request()
        .input('Username', mssql.Char(10), uname)
        .input('OldPassword', mssql.VarChar(50), encode(req.body.oldpassword))
        .input('NewPassword', mssql.VarChar(50), encode(req.body.newpassword))
        .execute('update_CustomerPassword', (err, result) => {
          if(err){
            console.log(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            var returnVal = result.returnValue;
            if(returnVal == 2){
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Missing Input!'});
            }else if(returnVal == 1){
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Invalid credentials'});
            }else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Succeeded'});
            }
          }
        });
    }
  });

});
router.route('/get').post( (req, res, next) => {
  console.log("Prepare to get users...");
  var token = req.body.params.token;
  jwt.verify(token, secretKey,async(err, decoded) => {
    if(err || decoded.userType != "Customer"){
      console.log(err);
    }else{
      var uname = decoded.username;
      const connect = await connection;
      const request = await connect.request()
        .input('Username', mssql.Char(10), uname)
        .execute('get_Customer', (err, result) => {
          if(err){
            console.log(err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            var returnVal = result.returnValue;
            if(returnVal == 3){
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Missing Input!'});
            }else if(returnVal == 2){
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Invalid credentials'});
            }else {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Succeeded', content: result.recordset});
            }
          }
        });
    }
  });
});
module.exports = router;
