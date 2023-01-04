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
 /* Date updating Function */
 var myDate = new Date(),
 day = myDate.getDate();
var day2 = day
var limit = 31
add = 1
if (day2 + add > limit) {
 day2 = (day2 + add) - limit
} else {
 day2 = day2 + add
}

var day3 = day
var limit = 31
add1 = 2
if (day3 + add1 > limit) {
 day3 = (day3 + add1) - limit
} else {
 day3 = day3 + add1
}


var day4 = day
var limit = 31
add2 = 3
if (day4 + add2 > limit) {
 day4 = (day4 + add2) - limit
} else {
 day4 = day4 + add2
}


var day5 = day
var limit = 31
add3 = 4
if (day5 + add3 > limit) {
 day5 = (day5 + add3) - limit
} else {
 day5 = day5 + add3
}


var day6 = day
var limit = 31
add4 = 5
if (day6 + add4 > limit) {
 day6 = (day6 + add4) - limit
} else {
 day6 = day6 + add4
}

var day7 = day
var limit = 31
add5 = 6
if (day7 + add5 > limit) {
 day7 = (day7 + add5) - limit
} else {
 day7 = day7 + add5
}

/* Date Updating Function End */
    
    res.render('worker/home', { admin: false, workerlog: true, userlog: false, worker,day,day2,day3,day4,day5,day6,day7})
  
  
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
  if (req.session.loggedIn) {
    res.render('/worker/worker-login')
  } else {
    res.render('worker/worker-login', { "loginErr": req.session.loginErr })
    req.session.loginErr = false
  }
})


router.post('/worker-login', (req, res) => {
  workerLogin.doWorkerLogin(req.body).then((response) => {
    if (response.status == true) {
      req.session.loggedIn = true
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
    res.render('worker/worker-profile', { worker })
  })
})
/* Worker Active Status Updater */
router.post('/activeStatus/:id', (req, res) => {
  var updateId = req.params.id
  var activeData = req.body.activeStatus
  workerHelpers.updateActiveStatus(updateId, activeData).then((updatedData) => {
    userHelpers.displayWorkerDetails(updateId).then((worker) => {
      res.render('worker/worker-profile', { worker })
    })
  })
})
module.exports = router;