var express = require('express');
const { render} = require('../app');
const workerHelpers = require('../helpers/worker-helpers');
var router = express.Router();
var workerHelper=require('../helpers/worker-helpers')
/* GET users listing. */
router.get('/', function(req, res, next) {
  workerHelpers.getAllWorkers().then((workers)=>{

    res.render('admin/view-workers',{admin:true,workers})
  })
  
});

router.get('/add-workers',function(req, res,){
  res.render('admin/add-workers')
});

router.post('/add-workers',(req,res)=>{
console.log(req.body);
console.log(req.files.Image);
workerHelpers.addWorker(req.body,(id)=>{
  let image=req.files.Image
  image.mv('./public/worker-images/'+id+'.jpg',(err,done)=>{
    if(!err){
      res.render("admin/add-workers")
    }
  })
  
})
})

module.exports = router;
