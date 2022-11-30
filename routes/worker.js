var express = require('express');
const { render} = require('../app');
var router = express.Router();
const workerHelpers = require('../helpers/worker-helpers');
const userHelpers=require('../helpers/user-helpers');
const workerLogin=require('../helpers/worker_login-helper');
const session = require('express-session');
/* Worker Home Page */
router.get('/', function(req, res){
    res.render('worker/home',{admin:false,workerlog:true,userlog:false})
})
/* Worker Signup Page */

  router.get('/signup', function(req, res, next) {
    res.render('worker/signup',{admin:false,workerlog:true})
  })

  router.post('/signup', function(req, res, next) {
    workerLogin.doWorkerSignup(req.body).then((id)=>{
      console.log(req.files.Image)
      let image = req.files.Image
      let image2 = req.files.Image2
      let image3 = req.files.Image3
      image.mv('./public/workerImages/'+id+'.jpg')
      image2.mv('./public/certificateImages/'+id+'.jpg')
      image3.mv('./public/addharImages/'+id+'.jpg')
      res.redirect("worker-login")
    })
  })
  
/* Worker Login Page */
router.get('/worker-login',function(req, res, next){
  res.render('worker/worker-login',{admin:false,workerlog:true})
})
module.exports =router;