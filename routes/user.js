var express = require('express');
var router = express.Router();
const workerHelpers = require('../helpers/worker-helpers');
const userHelpers=require('../helpers/user-helpers');
const session = require('express-session');
var transporter=require('../helpers/nodeMailer')
/* Show Profile Of All Workers */
router.get('/', function(req, res, next) {
  let user=req.session.user
  workerHelpers.getAllWorkers().then((workers)=>{
    
    
    res.render('user/view-workers',{admin:false,workerlog:false,userlog:true,workers,user})
  })
});
/* User Login */
router.get('/login', function(req, res, next) {
  if(req.session.loggedIn){
    res.render('user/login',{admin:false,workerlog:false,userlog:true})
  }else{
  res.render('user/login',{"loginErr":req.session.loginErr})
  req.session.loginErr=false
  }
})

router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status==true){
      req.session.loggedIn=true
      req.session.user=response.user
      var userData=req.session.user
      workerHelpers.getAllWorkers().then((workers)=>{
        let user=req.session.user
        userHelpers.getUser(user._id).then((users)=>{
          res.render('user/view-workers',{admin:false,workerlog:false,userlog:true,workers,users,user:req.session.user})
          console.log("data is")
          console.log(users)
        })
        
      })
      
    }else{
      req.session.loginErr="Invalid Email Or Password"
      res.redirect('/login')
    }
  })
})

/* User Signup */
router.get('/signup', function(req, res, next) {
  res.render('user/signup',{admin:false})
})

router.post('/signup', function(req, res, next) {
  userHelpers.doSignup(req.body).then((response)=>{
  res.redirect('/login')
  })
})
/* User Log Out */
router.get('/logout', function(req, res, next) {
  req.session.destroy()
  res.redirect('/')
  req.session.loggedIn=false
})

/* View Worker Profile */
router.get('/worker-profile/:id',(req,res)=>{
  let workerId=req.params.id
  userHelpers.displayWorkerDetails(workerId).then((dispDetails)=>{
    userHelpers.findAllReviews(workerId).then((reviews)=>{
      console.log(reviews)
      res.render('user/worker-profile',{dispDetails,user:req.session.user,reviews,userlog:true})
    })
    
  })
})

/* Worker Details Sorting */
router.post('/sort',(req,res)=>{
 
  var category=req.body.category
  var place=req.body.place
  userHelpers.sortWorkerDetails(category,place).then((workers)=>{
    res.render('user/view-workers',{admin:false,workerlog:false,userlog:true,workers})
  })
})

/* Contact Worker */
router.get('/contact/:id',(req,res)=>{
  var cId=req.params.id
  var userId=req.body.userId
  userHelpers.displayWorkerDetails(cId).then((conDetails)=>{
    res.render('user/workerContact',{conDetails,userId,user:req.session.user,admin:false,workerlog:false,userlog:true})
  })
})

router.post('/contactWorker',(req,res)=>{
  userHelpers.contactWorker(req.body).then((data)=>{
    res.redirect('/submit')
  })

})

router.get('/submit',(req,res)=>{
  res.render('user/submitted',{admin:false,workerlog:false,userlog:true,user:req.session.user})
})

/* Show All Bookings */

router.get('/myBookings/:Id',(req,res)=>{
  userHelpers.getWorkerId(req.params.Id).then((response)=>{
    if(response.found==true){
      userHelpers.getBookingInfo(response.bookingData.workerId).then((bookedData)=>{
        res.render('user/myBookings',{bookedData})
        console.log(response.bookingData.workerId)
        console.log(bookedData)
      })
    }else{
      res.render('user/empty-message',{admin:false,workerlog:false,userlog:true,user:req.session.user})
    }
  
  })
  
})

/*show accepted bookings*/

router.get('/ongoingBookings/:Id',(req, res)=>{
  userHelpers.getConfirmedInfo(req.params.Id).then((confirmData)=>{
    res.render('user/ongoingBooking',{confirmData,admin:false,workerlog:false,userlog:true,user:req.session.user})
  })
  
})

/*show detailed info of accepted booking*/
router.get('/bookingDetails/:Id',(req, res)=>{
  userHelpers.getTrackInfo(req.params.Id).then((trackData)=>{
    res.render('user/bookingDetails',{trackData,admin:false,workerlog:false,userlog:true,user:req.session.user})
  })
  
})

/*user submitting work completion*/
router.get('/userAuth/:Id',(req, res)=>{
  userHelpers.authenticateWorkCompletion(req.params.Id).then((authData)=>{
    userHelpers.getTrackInfo(req.params.Id).then((trackData)=>{
      userHelpers.changeCurrentStatus(trackData.workerId).then((upStatus)=>{
        
      })
    })
    userHelpers.getTrackInfo(req.params.Id).then((trackData)=>{
      res.render('user/bookingDetails',{trackData,admin:false,workerlog:false,userlog:true,user:req.session.user})
    })
  })
})

/*review submission*/
router.post('/reviewSubmit/:Id',(req, res)=>{
  userHelpers.reviewSubmit(req.body).then((reviewData)=>{
    /* get work info and save it to another collection for further refrence */
    userHelpers.getTrackInfo(req.params.Id).then((trackData)=>{
      userHelpers.saveBookingInfo(trackData).then((savedData)=>{
        userHelpers.deleteBookingInfo(req.params.Id).then((deletedData)=>{
          res.redirect('/')
        })
      })
    })
  })
})

/* show previous bookings */
router.get('/previousBookings/:Id',(req, res)=>{
  userHelpers.findPreviousBookings(req.params.Id).then((prevData)=>{
    res.render('user/previousBookings',{admin:false,workerlog:false,userlog:true,user:req.session.user,prevData})
  })
})
/* show previous booking details */
router.get('/showPreviousBooking/:Id',(req, res)=>{
  userHelpers.findPreviousBookingsWithId(req.params.Id).then((sPrevData)=>{
    console.log(sPrevData)
    res.render('user/previousBookingDetails',{admin:false,workerlog:false,userlog:true,user:req.session.user,sPrevData})
  })
})

/* Complaint Submission Page */
router.get('/complaints/:Id',(req, res)=>{
  var id=req.params.Id;
  res.render('user/submitComplaint',{admin:false,workerlog:false,userlog:true,user:req.session.user,id})
})


router.post('/complaintSubmission',(req, res)=>{
  console.log(req.body)
  userHelpers.complaintSubmission(req.body).then((complaintInfo)=>{
    res.redirect('/')
  })
})




module.exports = router;
