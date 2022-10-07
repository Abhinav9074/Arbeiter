var express = require('express');
var router = express.Router();
const workerHelpers = require('../helpers/worker-helpers');
const userHelpers=require('../helpers/user-helpers')
/* GET home page. */
router.get('/', function(req, res, next) {
  workerHelpers.getAllWorkers().then((workers)=>{

    res.render('user/view-workers',{admin:false,workers})
  })
});

router.get('/login', function(req, res, next) {
  res.render('user/login',{admin:false})
})

router.get('/signup', function(req, res, next) {
  res.render('user/signup',{admin:false})
})

router.post('/signup', function(req, res, next) {
  userHelpers.doSignup(req.body).then((response)=>{
   console.log(req.body)
  })
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body)
})
module.exports = router;
