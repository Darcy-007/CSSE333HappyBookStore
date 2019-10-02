var express = require('express');
var router = express.Router();
var config = require('../config').config;
var mssql = require('mssql');
var jwt = require('jsonwebtoken');
var connection = require('../connection').connection;
var secretKey = require('../config').secretKey;

router.route('/add').post(async (req, res) => {
    console.log("Add a book");var token = req.query.token;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if(err || decoded.userType != "Manager"){
      console.log(err);
    }else {
      const connect = await connection;
      const request = await connect.request()
        .input('ISBN', mssql.Char(13), req.body.ISBN)
        .input('SellingPrice', mssql.VarChar(6), req.body.SellingPrice)
        .input('BelongTo', mssql.VarChar(2), req.body.BelongTo)
        .input('Name', mssql.VarChar(50), req.body.Name)
        .input('Quantity', mssql.int, req.body.Quantity)
        .execute('insert_Book', (err, result) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          } else {
            var returnVal = result.returnValue;
            if (returnVal == 0) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Book Added Successfully!'});
            } else if (returnVal == 2) {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Incorrect StoreID'});
            } else {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Please fillout every attribute'});
            }
          }
        });
    }});
});
router.route('/delete').post(async (req, res) => {
  console.log("delete a book");
  var token = req.query.token;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err || decoded.userType != "Manager") {
      console.log(err);
    } else {

      const connect = await connection;
      const request = await connect.request()
        .input('BookID', mssql.VarChar(10), req.body.BookID)
        .execute('delete_Book', (err, result) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          } else {
            var returnVal = result.returnValue;
            if (returnVal == 0) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Book Deleted!'});
            } else {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'This book doesnot exist!'});
            }
          }
        });
    }
  });
});
router.route('/update').post(async (req, res) => {
  console.log("Updating a book");
  console.log(req.body);
  var token = req.query.token;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err || decoded.userType != "Manager") {
      console.log(err);
    } else {
      const connect = await connection;
      const request = await connect.request()
        .input('BookID', mssql.Char(10), req.body.BookID)
        .input('ISBN', mssql.Char(13), req.body.ISBN)
        .input('SellingPrice', mssql.VarChar(10), req.body.SellingPrice)
        .input('BelongTo', mssql.VarChar(2), req.body.BelongTo)
        .input('Name', mssql.VarChar(50), req.body.Name)
        .execute('update_Book', (err, result) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/jso n');
            console.log(err);
            res.json({err: err});
          } else {
            var returnVal = result.returnValue;
            if (returnVal == 0) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: 'Book Updated!'});
            } else if (returnVal == 1) {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Incorrect BookID'});
            } else {
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: 'Incorrect StoreID'});

            }
          }
        });
    }
  });
});

router.route('/getAll').post((req, res) =>{
  console.log("Fetching all the books...");
  var token = req.body.params.token;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if(err){
      console.log(err);
    }else{
      const connect = await connection;
      const request = await connect.request()
      .execute('get_Allbooks', (error, result) => {
        if(error){
          res.statusCode = 500;
          console.log(error);
          res.setHeader('Content-Type', 'application/json');
          res.json({err: error});
        }else{
          if(result.returnValue == 0){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Books Fetched!', content: result.recordset});
          }else{
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Fail to fetch books'});
          }
        }
      })
    }
  });
});


router.route('/').post((req, res) => {
  console.log("Fetching book");
  var token = req.query.token;
  var Uname = "";
  jwt.verify(token, secretKey, async(err, decoded) => {
    if(err){
      console.log(err);
    }else{
      const connect = await connection;
      const request = await connect.request()
      .input('BookID', mssql.VarChar(10), req.body.BookID)
      .execute('get_Book', (err, result) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        }else{
          var returnVal = result.returnValue;
          if(returnVal == 3){
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Book ID cannot be null'});
          }else if(returnVal == 2){
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Invalid book ID'});
          }else if (returnVal == 0){
            res.statusCode = 200;
            console.log(result);
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: "Book fetched", content: result.recordset[0]});
          }
        }
      });
    }
  });

});

router.route('/filterBook').post((req, res) => {
  console.log("applying filter");
  var token = req.query.token;
  console.log(req.body);
  jwt.verify(token, secretKey, async(err, decoded) => {
    if (err) {
      console.log(err);
    } else {
      storename = req.body.storename == '' ? null : req.body.storename;
      bookname = req.body.bookname == '' ? null : req.body.bookname;
      const connect = await connection;
      const request = await connect.request()
        .input('StoreName', mssql.VarChar(20), storename)
        .input('bookName', mssql.VarChar(50), bookname)
        .execute('get_booksFilter', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: "Books fetched", content: result.recordset });
            console.log(result);
          }
        })
    }
  });
});
router.route('/getReview').post((req, res) => {
  var token = req.query.token;
  jwt.verify(token, secretKey, async(err, decoded) => {
    if (err||decoded.userType != "Customer") {
      console.log(err);
    } else {
      username = decoded.username;
      bookid = req.body.OrderID;
      const connect = await connection;
      const request = await connect.request()
        .input('Username', mssql.Char(10), username)
        .input('OrderID', mssql.VarChar(10), bookid)
        .execute('get_review', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            if(result.returnValue == 0){
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: "Review Fetched", content: result.recordset[0] });
            }else{
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: "Review Fetch failed"});
            }
          }
        })
    }
  });
})

router.route('/insertReview').post((req, res) => {
  var token = req.query.token;
  jwt.verify(token, secretKey, async(err, decoded) => {
    if (err||decoded.userType != "Customer") {
      console.log(err);
    } else {
      username = decoded.username;
      bookid = req.body.OrderID;
      score = req.body.Score;
      const connect = await connection;
      const request = await connect.request()
        .input('Username', mssql.Char(10), username)
        .input('OrderID', mssql.VarChar(10), bookid)
        .input('ScoreS', mssql.VarChar(1), score)
        .execute('insertorupdate_Review', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            if(result.returnValue == 0){
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: "Review inserted or updated"});
            }else{
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: "Review insert or update failed"});
            }
          }
        })
    }
  });
});

router.route('/getScore').post((req, res) => {
  var token = req.query.token;
  jwt.verify(token, secretKey, async (err, decoded) => {
    if(err){
      console.log(err)
    }else{
      const connect = await connection;
      const request = await connect.request()
        .input('BookID', mssql.Char(10), req.body.BookID)
        .execute('get_book_score', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            if(result.returnValue == 0){
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: "Book score fetched", content: result.recordset[0]});
            }else{
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: "Book score fetch failed"});
            }
          }
        })
    }
  })
})

router.route('/insertLike').post((req, res) => {
  var token = req.query.token;
  jwt.verify(token, secretKey, async(err, decoded) => {
    if (err||decoded.userType != "Customer") {
      console.log(err);
    } else {
      var username = decoded.username;
      var bookid = req.body.BookID;
      console.log(bookid);
      const connect = await connection;
      const request = await connect.request()
        .input('Username', mssql.Char(10), username)
        .input('BookID', mssql.VarChar(10), bookid)
        .execute('insert_Likes', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            if(result.returnValue == 0){
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: "Likes inserted"});
            }else{
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: "Likes not inserted"});
              console.log(result);
            }
          }
        })
    }
  });
});


router.route('/deleteLike').post((req, res) => {
  var token = req.query.token;
  jwt.verify(token, secretKey, async(err, decoded) => {
    if (err||decoded.userType != "Customer") {
      console.log(err);
    } else {
      var username = decoded.username;
      var bookid = req.body.BookID;
      const connect = await connection;
      const request = await connect.request()
        .input('Username', mssql.Char(10), username)
        .input('BookID', mssql.VarChar(10), bookid)
        .execute('delete_Likes', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            if(result.returnValue == 0){
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: "Likes deleted"});
            }else{
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: "Likes not deleted"});
              console.log(result);
            }
          }
        })
    }
  });
});

router.route('/islike').post((req, res) => {
  var token = req.query.token;
  jwt.verify(token, secretKey, async(err, decoded) => {
    if(err || decoded.userType != "Customer") {
      console.log(err);
    }else{
      var username = decoded.username;
      const connect = await connection;
      const request = await connect.request()
        .input('Username', mssql.Char(10), username)
        .input('BookID', mssql.Int, req.body.bookID)
        .execute('is_liked', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            if(result.returnValue == 2){
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: "Failed"});
            }else{
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: result.returnValue});
            }
          }
        })
    }
  })
});

router.route('/getAllLikes').post((req, res) => {
  var token = req.query.token;
  jwt.verify(token, secretKey, async(err, decoded) => {
    if(err || decoded.userType != "Customer") {
      console.log(err);
    }else{
      var username = decoded.username;
      var connect = await connection;
      var request = await connect.request()
        .input('Username', mssql.Char(10), username)
        .execute('get_Likes', (err, result) => {
          if(err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
          }else{
            if(result.returnValue == 2){
              res.statusCode = 403;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, status: "Invalid customer ID"});
            }else{
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: true, status: "Fetched all favorites", content: result.recordset});
            }
          }
        });
    }
  });
});



module.exports = router;
