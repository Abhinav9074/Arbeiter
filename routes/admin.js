var express = require('express');
const { render } = require('../app');
const workerHelpers = require('../helpers/worker-helpers');
var router = express.Router();
var workerHelper = require('../helpers/worker-helpers');
const worker_loginHelper = require('../helpers/worker_login-helper');
const workerLogin = require('../helpers/worker_login-helper');

/* List All Worker Details */
router.get('/', function (req, res, next) {
  workerHelpers.getAllWorkers().then((workers) => {
    res.render('admin/view-workers', { workerlog: false, admin: true, userlog: true, workers })
  })

});

/* Add Worker Feature */
router.get('/add-workers', function (req, res,) {
  res.render('admin/add-workers')
});

router.post('/add-workers', (req, res) => {
  console.log(req.body);
  console.log(req.files.Image);
  workerHelpers.addWorker(req.body, (id) => {
    let image = req.files.Image
    image.mv('./public/worker-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render("admin/add-workers")
      }
    })

  })
})

/* Worker Signup Notification Viewer */

router.get('/notifications', function (req, res, next) {
  workerLogin.getWorkerDetaials().then((workerDetails) => {
    res.render('admin/notification', { workerlog: false, admin: true, userlog: true, workerDetails })
  })
})

router.get('/showDetails/:id', async (req, res) => {
  let signupDetails = await workerLogin.getWorkerSignupDetails(req.params.id).then((workerData)=>{
    console.log(workerData);
    res.render('admin/showDetails',{ workerlog: false, admin: true, userlog: true,workerData})
  })
})

/* Worker Application Rejection */
router.get('/delete-workerDetails/:id',(req,res) => {
  let workerId=req.params.id
  worker_loginHelper.deleteWorkerApplication(workerId).then((response) => {
    res.redirect('/admin/notifications')
  })
})
module.exports = router;
