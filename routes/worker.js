var express = require('express');
const { render } = require('../app');
var router = express.Router();
const workerHelpers = require('../helpers/worker-helpers');
const userHelpers = require('../helpers/user-helpers');
const workerLogin = require('../helpers/worker_login-helper');
const session = require('express-session');
/* Worker Home Page */
router.get('/', function (req, res) {
  let worker = req.session.worker
  res.render('worker/home', { admin: false, workerlog: true, userlog: false, worker })
})
/* Worker Signup Page */

router.get('/signup', function (req, res, next) {
  res.render('worker/signup', { admin: false, workerlog: true })
})

router.post('/signup', function (req, res, next) {
  workerLogin.doWorkerSignup(req.body).then((id) => {
    let image = req.files.Image
    let image2 = req.files.Image2
    let image3 = req.files.Image3
    image.mv('./public/workerImages/' + id + '.jpg')
    image2.mv('./public/certificateImages/' + id + '.jpg')
    image3.mv('./public/addharImages/' + id + '.jpg')
    res.redirect("worker-login")
  })
})

/* Worker Login */
router.get('/worker-login', function (req, res, next) {
  if (req.session.WloggedIn) {
    res.render('/worker/worker-login')
  } else {
    res.render('worker/worker-login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})


router.post('/worker-login', (req, res) => {
  workerLogin.doWorkerLogin(req.body).then((response) => {
    if (response.status == true) {
      req.session.WloggedIn = true
      req.session.worker = response.worker
      res.redirect('/worker')
    } else {
      req.session.loginErr = "Invalid Email Or Password"
      res.redirect('/worker/worker-login')
    }
  })
})


/* Worker Password Setting */
router.get('/setWorkerPassword', function (req, res) {
  res.render('worker/password', { admin: false, workerlog: true })
})
router.post('/setPass', (req, res) => {
  var passId = req.body.id
  var pass = req.body.password
  workerLogin.setWorkerPassword(passId, pass).then(() => {
    res.redirect("worker-login")
  })
})

/* Worker Log Out */
router.get('/logoutWorker', function (req, res, next) {
  req.session.destroy()
  res.redirect('worker-login')
  req.session.loggedIn = false
})
/* Worker Profile View by Worker */
router.get('/workerAccount/:id', (req, res) => {
  var wId = req.params.id
  userHelpers.displayWorkerDetails(wId).then((worker) => {
    res.render('worker/worker-profile', { worker, admin: false, workerlog: true, userlog: false, worker: req.session.worker })
  })
})
/* Worker Active Status Updater */
router.post('/activeStatus/:id', (req, res) => {
  var updateId = req.params.id
  var activeData = req.body.activeStatus
  workerHelpers.updateActiveStatus(updateId, activeData).then((updatedData) => {
    userHelpers.displayWorkerDetails(updateId).then((worker) => {
      res.render('worker/worker-profile', { worker, admin: false, workerlog: true, userlog: false, worker: req.session.worker })
    })
  })
})


/* Worker Current Status Updater */
router.post('/currentStatus/:id', (req, res) => {
  var currentId = req.params.id
  var currentData = req.body.currentStatus
  workerHelpers.updateCurrentStatus(currentId, currentData).then((updatedCurrentData) => {
    userHelpers.displayWorkerDetails(currentId).then((worker) => {
      res.render('worker/worker-profile', { worker })
    })
  })
})

/*Work Notification Viewer */
router.get('/workNotificationViewer/:id', (req, res) => {
  workerHelpers.getWorkNotification(req.params.id).then((workNotification) => {
    res.render('worker/workNotification', { workNotification })
  })

})


/* Work Notification Details Viewer */
router.get('/showDetails/:Id', (req, res) => {
  workerHelpers.getWorkNotificationDetails(req.params.Id).then((contactDetails) => {
    res.render('worker/showContactDetails', { contactDetails, worker: req.session.worker, admin: false, workerlog: true, userlog: false })
    console.log('details are')

  })
})


/* Reject booking details*/
router.get('/reject-bookingDetails/:Id', (req, res) => {
  workerHelpers.rejectBooking(req.params.Id).then((rejectDetails) => {
    res.redirect('/worker')
  })
})


/* Accept Booking Details */
router.post('/accept-bookingDetails/:Id', (req, res) => {
  /* current status set to busy */
  workerHelpers.updateCurrentStatusToBusy(req.body.workerId).then((upDetails) => {
    /*take data from user and worker using their ID*/
    workerHelpers.getSpecificWorkerDetails(req.body.workerId).then((specificWorkerData) => {
      workerHelpers.getSpecificUserDetails(req.params.Id).then((specificUserData) => {
        /* add details of both user and worker to a single collection */
        workerHelpers.mergeData(specificWorkerData).then((mergedData) => {
          workerHelpers.updateMergeData(specificUserData, mergedData).then((mergedData2) => {
            /* add user and worker ID to the bookings collection */
            workerHelpers.addId(mergedData, req.params.Id, req.body.workerId).then((updateId) => {
              /* delete the notification data */
              workerHelpers.deleteContactData(req.params.Id).then((deleteData) => {
              })
            })
          })
        })
      })
    })
    res.redirect('/worker')
  })
})

module.exports = router;