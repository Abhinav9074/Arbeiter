var express = require('express');
var router = express.Router();
const workerHelpers = require('../helpers/worker-helpers');
const userHelpers=require('../helpers/user-helpers');
const session = require('express-session');
/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  workerHelpers.getAllWorkers().then((workers)=>{
    res.render('user/view-workers',{admin:false,workers,user})
  })
});

router.get('/login', function(req, res, next) {
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
  res.render('user/login',{"loginErr":req.session.loginErr})
  req.session.loginErr=false
  }
})

router.get('/signup', function(req, res, next) {
  res.render('user/signup',{admin:false})
})

router.post('/signup', function(req, res, next) {
  userHelpers.doSignup(req.body).then((response)=>{
    res.redirect('/login')
  })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status==true){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }else{
      req.session.loginErr="Invalid Email Or Password"
      res.redirect('/login')
    }
  })
})
router.get('/logout', function(req, res, next) {
  req.session.destroy()
  res.redirect('/login')
})
module.exports = router;
