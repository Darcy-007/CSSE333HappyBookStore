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
router.route('/login').post(async (req, res, next) => {
  console.log("Prepare to login manager...");
  console.log(req.body);
  const connect = await connection;
  const request = await connect.request()
  .input('ManagerUsername', mssql.Char(10), req.body.username)
  .input('ManagerPassword', mssql.VarChar(50), encode(req.body.password))
  .execute('manager_login', (err, result) => {
    if(err){
      res.statusCode = 500;
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }else{
      var returnVal = result.returnValue;
      if(returnVal == 0){
        console.log(result);
        res.statusCode = 200;
        var token = jwt.sign({username: req.body.username, userType: "Manager"},
          secretKey, {expiresIn: 20 * 60});
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Login Succeeded!',token : token, userType : "Manager"});
      }else{
        res.statusCode = 403;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'Login Failed!'});
      }
    }
  });
});
router.route('/get').post((req, res, next) => {
  console.log("Prepare to login manager...");
  var token = req.body.params.token;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if(err){
      console.log(err);
    }else{
      var uname = decoded.username;
      const connect = await connection;
      const request = await connect.request()
      .input('Username', mssql.Char(10), uname)
      .execute('get_Manager', (err, result) => {
        if(err){
          res.statusCode = 500;
          console.log('failed');
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        }else{
          var returnVal = result.returnValue;
          if(returnVal == 0){
            console.log(result);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Manager get Succeeded!', content: result.recordset});
          }else if(returnVal == 2){
            console.log(result);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Manager not exist!'});
          } else {
            console.log(result);
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'please fill username'});
          }
        }
      });
    }
  })
});
module.exports = router;
