var express = require('express');
var router = express.Router();
const workerHelpers = require('../helpers/worker-helpers');

/* GET home page. */
router.get('/', function(req, res, next) {
  workerHelpers.getAllWorkers().then((workers)=>{

    res.render('user/view-workers',{admin:false,workers})
  })
 
});

module.exports = router;
