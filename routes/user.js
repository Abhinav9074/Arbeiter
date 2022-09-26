var express = require('express');
var router = express.Router();
const workerHelpers = require('../helpers/worker-helpers');

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
  
})
module.exports = router;
