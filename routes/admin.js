const { Router } = require('express');
var express = require('express');
const { render } = require('../app');
const workerHelpers = require('../helpers/worker-helpers');
var router = express.Router();
var workerHelper = require('../helpers/worker-helpers');
const worker_loginHelper = require('../helpers/worker_login-helper');
const workerLogin = require('../helpers/worker_login-helper');
const userHelpers=require('../helpers/user-helpers');
var transporter=require('../helpers/nodeMailer')

/* List All Worker Details */
router.get('/', function (req, res, next) {
  workerHelpers.getAllWorkersAdmin().then((workers) => {
    res.render('admin/view-workers', { workerlog: false, admin: true, userlog: true, workers })
  })
});
router.get('/view-workers', function (req, res, next) {
  workerHelpers.getAllWorkers().then((workers) => {
    res.redirect('/admin')
  })
})

/* View All Users */
router.get('/view-users',(req, res, next) => {
  userHelpers.getAllUsers().then((users) => {
    res.render('admin/view-users', { workerlog: false, admin: true, userlog: true, users })
  })
})

/* Worker Signup Notification Viewer */

router.get('/notifications', function (req, res, next) {
  workerLogin.getWorkerDetaials().then((workerDetails) => {
    res.render('admin/notification', { workerlog: false, admin: true, userlog: false, workerDetails })
  })
})

router.get('/showDetails/:id', async (req, res) => {
  let signupDetails = await workerLogin.getWorkerSignupDetails(req.params.id).then((workerData)=>{
    res.render('admin/showDetails',{ workerlog: false, admin: true, userlog: false,workerData})
  })
})

/* Worker Application Rejection */
router.get('/delete-workerDetails/:id',(req,res) => {
  let workerId=req.params.id
  worker_loginHelper.deleteWorkerApplication(workerId).then((response) => {
    res.redirect('/admin/notifications')
  })
})
/* Worker Application Approval */
router.get('/approve-application/:id',(req,res) => {
  var approvedWorker=req.params.id
  worker_loginHelper.getApprovedWorkerDetails(approvedWorker).then((approvedWorkerData)=>{
    /*Mail Sender*/
var mailOptions={
  from: 'arbeiter2k22@gmail.com',
  to: approvedWorkerData.workerEmail,
  subject:'Hey Your Application Has Been Approved',
  text:'Hello '+approvedWorkerData.workerName+' ,your application for worker registration has been approved, please set your login password using  this link  http://localhost:3000/worker/setWorkerPassword/'+approvedWorkerData._id+'      thank you'
}

transporter.sendMail(mailOptions,(err,info)=>{
  if (err){
    console.log(err)
    console.log('Cannot Send E-mail Due To an Error')
  }else{
    console.log('Mail sent')
  }
  /* Mail sender End */
})
    worker_loginHelper.addApprovedWorker(approvedWorkerData).then((data)=>{
      
    })
  })
  worker_loginHelper.deleteApprovedWorker(approvedWorker).then((deletedWorker)=>{
    res.redirect('/admin/notifications')
  })

})

/* Delete Worker Details */
router.get('/delete-worker-details/:id',(req, res)=>{
  var deleteId=req.params.id
  worker_loginHelper.deleteWorkerDetails(deleteId).then((response)=>{
    res.redirect('/admin')
  })
})

/* Edit Worker Details*/
router.get('/admin/worker-edit/:id',(req, res)=>{
  var workersId = req.params.id
  userHelpers.displayWorkerDetails(workersId).then((worker) => {
    res.render('/admin/worker-edit', {worker})
  })
})

router.get('/workReports',(req, res)=>{
  workerHelper.diplayAllCompletedWorks().then((completedWorks)=>{
    res.render('admin/reports',{ workerlog: false, admin: true, userlog: false,completedWorks})
  })
})

router.get('/reportDetails/:Id',(req, res)=>{
  workerHelper.diplayAllCompletedWorksWithId(req.params.Id).then((foundWorks)=>{
    res.render('admin/reportDetails',{ workerlog: false, admin: true, userlog: false,foundWorks})
  })
})

/* Complaint Box */
router.get('/complaintbox',(req, res)=>{
  
  userHelpers.viewAllComplaints().then((complaints)=>{
    res.render('admin/complaint',{ workerlog: false, admin: true, userlog: false , complaints})
  })
})

module.exports = router;
