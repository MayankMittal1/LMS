var express = require('express');
var router = express.Router();
const mysql = require("mysql");
var session = require('express-session');
var cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const saltRounds = 4;
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "lms",
});
connection.connect();
const crypto = require('crypto');
/* GET users listing. */
router.get('/', function(req, res, next) {
  var user=undefined
  var requests=undefined
  if(req.session.type=="student" & !req.query.q){
    connection.query(
      `select * from students where id="${req.session.uid}";`,
      (error, results, fields) => {
        user=results[0]
      }
    );
    connection.query(`select t.id,t.status,b.name,b.author,b.genre,b.image from transaction t join books b where t.book_id=b.id and t.student_id=${req.session.uid};`,(err,result)=>{
      requests=result
    })
    connection.query(`select * from books;`,(error,results)=>{
      res.render('userHome',{'user':user,'list':results.slice(0,10),'requests':requests});
    })
  }
  else if(req.session.type=="student"){
    var user=[]
    var books=[]
    var requests=undefined
    var q=req.query.q
    connection.query(
      `select * from students where id="${req.session.uid}";`,
          (error, results, fields) => {
              user=results[0]
          }
    );
    connection.query(`select t.id,t.status,b.name,b.author,b.genre,b.image from transaction t join books b where t.book_id=b.id and t.student_id=${req.session.uid};`,(err,result)=>{
      requests=result
    })
    connection.query(
        `select * from books;`,
          (error, results, fields) => {
            results.forEach(element => {
              if(element.name.toLowerCase().includes(q.toLowerCase()) || element.author.toLowerCase().includes(q.toLowerCase()) || element.genre.toLowerCase().includes(q.toLowerCase()) ){
                books.push(element)
                }
            });

            res.render('userHome',{'list':books,'user':user,'requests':requests});
          }
        );
  }
  else{
    res.redirect('/')
  }
});



router.post('/login', function(req, res, next) {
  connection.query(
    `select * from students where userid = "${req.body.userid}" and password = "${crypto.createHash('sha256').update(req.body.password).digest('hex')}";`,
    (error, results, fields) => {
      if (error) {
        res.writeHead(500);
        res.end('Invalid');
      } else {
        if (results.length > 0) {
          req.session.uid=results[0].id
          req.session.type="student"
          res.redirect('/student')
        } else {
          res.end("absent");
        }
      }
    }
  );
});

router.get('/checkout',(req,res)=>{
  if(req.session.type=="student"){
    var id=req.query.id
    var q=`select * from transaction where book_id = ${id} and student_id = ${req.session.uid} and status ="pending";`
    connection.query(q,(err,result)=>{
      if(result.length>0){
        res.redirect('/student')
      }
      else{
        q=`insert into transaction(book_id,student_id,status) values(${id},${req.session.uid},"pending");`
        connection.query(q,(err,result)=>{
          res.redirect('/student')
        });
      }
    })
  }
  else{
    res.redirect('/')
  }
})
router.get('/cancel',(req,res)=>{
  if(req.session.type=="student"){
    var id=req.query.id
    var q=`update transaction set status="cancelled" where id= ${id};`
    connection.query(q,(err,result)=>{
      res.redirect('/student')
    })
  }
  else{
    res.redirect('/')
  }
})
router.get('/logout',(req,res)=>{
  req.session.destroy(function(err) {
    res.redirect('/')
  })
})
module.exports = router;
