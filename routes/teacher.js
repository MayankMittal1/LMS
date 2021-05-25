var express = require('express');
var router = express.Router();
const mysql = require("mysql");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "lms",
});
connection.connect();
const crypto = require('crypto');

router.get('/', function(req, res, next) {
    if(req.session.uid & req.session.type=="teacher" & !req.query.q){
      connection.query(
        `select * from teachers where id="${req.session.uid}";`,
        (error, results, fields) => {
          res.render('teacherHome',{'list':[],'user':results[0]});
        }
      );
    }
    else if(req.session.uid & req.session.type=="teacher"){
      var user=[]
      var books=[]
      var q=req.query.q
      connection.query(
        `select * from teachers where id="${req.session.uid}";`,
            (error, results, fields) => {
                user=results[0]
            }
      );
      connection.query(
          `select * from books;`,
            (error, results, fields) => {
              results.forEach(element => {
                if(element.name.toLowerCase().includes(q.toLowerCase()) || element.author.toLowerCase().includes(q.toLowerCase()) || element.genre.toLowerCase().includes(q.toLowerCase()) ){
                    books.push(element)
                  }
              });
              console.log(books)
              res.render('teacherHome',{'list':books,'user':user});
            }
          );
    }
    else{
      res.redirect('/')
    }
  });
  

router.post('/login', function(req, res, next) {
    connection.query(
      `select * from teachers where userid="${req.body.uid}" and password = "${crypto.createHash('sha256').update(req.body.password).digest('hex')}";`,
      (error, results, fields) => {
          console.log(results)
        if (error) {
          res.writeHead(500);
          res.end("couldn't insert");
        } else {
          if (results.length > 0) {
                req.session.uid=results[0].id
                req.session.type="teacher"
                setTimeout(()=>res.redirect('/teacher'),10)
          } else {
            res.end("absent");
          }
        }
      }
    );
  });

router.get('/addBook',(req,res,next)=>{
    if(req.session.uid & req.session.type=="teacher"){
        var user=[]
        connection.query(
            `select * from teachers where id="${req.session.uid}";`,
            (error, results, fields) => {
                user=results[0]
                res.render('addBook',{'user':user})
            }
          );
    }
    else{
      res.redirect('/')
    }
});

router.post('/add',(req,res,next)=>{
    if(req.session.uid & req.session.type=="teacher"){
		var file = req.files.image
		var img_name=file.name          
        file.mv('public/images/uploads/'+file.name, function(err) {           
	        if (err) return res.status(500).send(err);
      		var sql = `insert into books(name,author,genre,quantity,image) values('${req.body.bookName}','${req.body.authorName}','${req.body.genre}',${req.body.quantity},'${img_name}') ;`
          connection.query(sql, function(err, result) {
            console.log(result + err)
            res.redirect('/teacher')
            });
			});
    }
    else{
      res.redirect('/')
    }
});

router.get('/edit',(req,res)=>{
  if(req.session.uid & req.session.type=="teacher"){
    var id = req.query.id
    connection.query(
      `select * from teachers where id="${req.session.uid}";`,
          (error, results, fields) => {
              user=results[0]
          }
    );
    connection.query(`select * from books where id = ${id};`,(err,results)=>{
      res.render('editdelete',{'book':results[0],'user':user})
    })
  }
  else{
    res.redirect('/')
  }
})

router.post('/saveBook',(req,res)=>{
  if(req.session.uid & req.session.type=="teacher"){
    if(!req.files){
      var q=`update books set name="${req.body.bookName}" , author="${req.body.authorName}", genre = "${req.body.genre}" , quantity=${req.body.quantity} where id=${req.query.id};`
      connection.query(q,(err,result)=>{
        res.redirect('/teacher')
      })
    }
    else{
      var file = req.files.image
      var img_name=file.name          
          file.mv('public/images/uploads/'+file.name, function(err) {           
            if (err) return res.status(500).send(err);
            var sql = `update books set name="${req.body.bookName}" , author="${req.body.authorName}", genre = "${req.body.genre}" , quantity=${req.body.quantity} , image="${img_name}" where id=${req.query.id};`
            connection.query(sql, function(err, result) {
              console.log(result + err)
              res.redirect('/teacher')
              });
        });
    }
  }
  else{
    res.redirect('/')
  }
})

router.get('/delete',(req,res)=>{
  if(req.session.uid & req.session.type=="teacher"){
    var id=req.query.id
    connection.query(`delete from books where id = ${id};`,(err,result)=>{
      if(err){
        res.end('error')
      }
      else{
        res.redirect('/teacher')
      }
    })
  }
  else{
    res.redirect('/')
  }
})
router.get('/addStudent',(req,res)=>{
  if(req.session.uid & req.session.type=="teacher"){
    connection.query(
      `select * from teachers where id="${req.session.uid}";`,
          (error, results, fields) => {
            res.render('addStudent',{'user':results[0]})
          }
    );
  }
  else{
    res.redirect('/')
  }
})
router.post('/addStudent',(req,res)=>{
  if(req.session.uid & req.session.type=="teacher"){
    connection.query(`insert into students(name,phone,userid,password) values('${req.body.studentName}',"${req.body.phone}","${req.body.userid}","${crypto.createHash('sha256').update(req.body.password).digest('hex')}");`,(err,result)=>{
      res.redirect('/teacher')
    })
  }
  else{
    res.redirect('/')
  }
})

router.get('/requests',(req,res)=>{
  if(req.session.uid & req.session.type=="teacher"){
    connection.query(
      `select * from teachers where id="${req.session.uid}";`,
          (error, results, fields) => {
              user=results[0]
          }
    );
    connection.query(`select t.id,t.status,b.name book,b.quantity,b.image,s.name,s.userid,t.issue_date,t.return_date from transaction t join books b join students s where t.book_id=b.id and s.id=t.student_id  ORDER BY FIELD(t.status, 'pending','declined','issued','returned','cancelled');`,(err,result)=>{
      console.log(result)
      res.render('viewRequests',{'user':user,'requests':result})
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

router.get('/approve',(req,res)=>{
  if(req.session.type=="teacher"){
    var id=req.query.id
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var curDate= year + "-" + month + "-" + date
    connection.query(`update transaction set issue_date="${curDate}" , teacher_id=${req.session.uid}, status="issued" where id=${id};`,(err,result)=>{
      if(err){
        console.log(err)
      }
      else{
        res.redirect('/teacher/requests')
      }
    })
  }
  else{
    res.redirect('/')
  }
})
router.get('/return',(req,res)=>{
  if(req.session.type=="teacher"){
    var id=req.query.id
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var curDate= year + "-" + month + "-" + date
    connection.query(`update transaction set return_date="${curDate}" , status="returned" where id=${id};`,(err,result)=>{
      if(err){
        console.log(err)
      }
      else{
        res.redirect('/teacher')
      }
    })
  }
  else{
    res.redirect('/')
  }
})
router.get('/decline',(req,res)=>{
  if(req.session.type=="teacher"){
    var id=req.query.id
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var curDate= year + "-" + month + "-" + date
    connection.query(`update transaction set status="declined" where id=${id};`,(err,result)=>{
      if(err){
        console.log(err)
      }
      else{
        res.redirect('/teacher')
      }
    })
  }
  else{
    res.redirect('/')
  }
})
module.exports = router;