var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('../app')
var objectId=require('mongodb').ObjectId
module.exports = {

    /* USER SIGNUP */
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password=await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId)
            })
        })

    },
    /* Find User By Email*/
    findUser :(emailData)=>{
        return new Promise(async(resolve, reject) => {
            db.get().collection(collection.APPROVED_WORKER_COLLECTION).findOne({email:emailData}).then((email)=>{
                resolve(email)
            })
        })
    },
    /* USER LOGIN */
    doLogin: (loginData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:loginData.Email})
            if (user) {
                bcrypt.compare(loginData.Password,user.password).then((status) => {
                    if (status) {
                        console.log("login-success");
                        response.user=user
                        response.status=true
                        resolve(response)
                        
                    } else {
                        console.log("login-failed");
                        resolve({status:false})
                    }
                })
            } else {
                console.log("login-failed");
                resolve({status:false})

            }
        })
    },
    /* USER VIEWER FUNCTION FOR ADMIN */
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    /* Worker Details Viewer For User */
    displayWorkerDetails:(workerId)=>{
        return new Promise(async(resolve,reject)=>{
            let dispDetails=await db.get().collection(collection.APPROVED_WORKER_COLLECTION).findOne({_id:objectId(workerId)}).then((dispDetails)=>{
                resolve(dispDetails)
            })
        })
    },
    /* Worker Info Sorting*/
    sortWorkerDetails:(category,place)=>{
        return new Promise(async(resolve,reject)=>{
            console.log("category is"+category)
            console.log("place is"+place)
            let sortData=await db.get().collection(collection.APPROVED_WORKER_COLLECTION).find({ "category": category,"workerPlace": place ,"activeStatus": "Active"}).toArray()
            resolve(sortData)
        })
    },




    /*Worker Contact */
    contactWorker:(contactData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORKER_CONTACT_COLLECTION).insertOne(contactData).then((data) => {
                resolve(data.insertedId)
            })
        })
    },
    /* Get User By Id */
    getUser:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).findOne(userId).then((SelUserData)=>{
                resolve(SelUserData)
            })
        })
    },

    /* worker Id getting function*/
    getWorkerId:(Id)=>{
        let response={}
        let found 
        return new Promise(async(resolve,reject)=>{
            let bookingData =await db.get().collection(collection.WORKER_CONTACT_COLLECTION).findOne({"userId":Id},{ projection:{_id:0,workerId:1}})
            if(bookingData){
                response.bookingData=bookingData
                response.found=true
                resolve(response)
            }else{
                response.found=false
                resolve(response)
            }
           
        })

    },

    /*display the booked worker data in user page*/
    getBookingInfo:(bookId)=>{
        return new Promise(async(resolve,reject)=>{
       let WorkerData = await db.get().collection(collection.APPROVED_WORKER_COLLECTION).findOne({_id:objectId(bookId)})
        resolve(WorkerData)
       
       
    })
    },
    /*display the confirmed booking data*/
    getConfirmedInfo:(conId)=>{
        console.log(conId)
        return new Promise(async(resolve,reject)=>{
            let ConfirmedData= await db.get().collection(collection.CONFIRMED_BOOKING_COLLECTION).findOne({"userId":conId})
            resolve(ConfirmedData)
        })
    },
    /*get Tracking Info*/
    getTrackInfo:(trackId)=>{
        return new Promise(async(resolve,reject)=>{
            let trackData= await db.get().collection(collection.CONFIRMED_BOOKING_COLLECTION).findOne({"_id":objectId(trackId)})
            resolve(trackData)
        })
    },
    /* user authentication of work completion*/
    authenticateWorkCompletion:(authId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.CONFIRMED_BOOKING_COLLECTION).updateOne({"_id": objectId(authId)}, {
                $set: {

                    userAuth: "true"

                }
            }).then((comData)=>{
                resolve(comData)
        })
        })
    },
    /* Change Worker Current Status */
    changeCurrentStatus:(statusId)=>{
        return new Promise(async(resolve,reject)=>{
            db.get().collection(collection.APPROVED_WORKER_COLLECTION).updateOne({"_id": objectId(statusId)}, {
                $set: {

                    currentStatus: "free"

                }
            })
        })
    },
    /* submit review */
    reviewSubmit:(revData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_REVIEW).insertOne(revData).then((reviewData)=>{
                resolve(reviewData)
            })
        })
    },

    /* save all booking info for further refrence */
    saveBookingInfo:(saveData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.COMPLETED_WORK_COLLECTION).insertOne(saveData).then((savedInfo)=>{
                resolve(savedInfo)
            })
        })
    },
    /* delete booking info from ongoing collection */
    deleteBookingInfo:(delId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CONFIRMED_BOOKING_COLLECTION).findOneAndDelete({_id:objectId(delId)}).then((deletedId)=>{
                resolve(deletedId)
            })
        })
    },
    /*display all  reviews*/
    findAllReviews:(workerId)=>{
        console.log(workerId)
        return new Promise((resolve,reject)=>{
            var reviews = db.get().collection(collection.USER_REVIEW).find({"workerId": workerId}).toArray()
            resolve(reviews)
        })
    },
    /*display previous bookings*/
    findPreviousBookings:(preId)=>{
        return new Promise(async(resolve,reject)=>{
            var prevData =await db.get().collection(collection.COMPLETED_WORK_COLLECTION).find({"userId":preId}).toArray()
            resolve(prevData)
            console.log(preId)
        })
    },
    /*display previous bookings*/
    findPreviousBookingsWithId:(preIdS)=>{
        return new Promise(async(resolve,reject)=>{
            var prevData =await db.get().collection(collection.COMPLETED_WORK_COLLECTION).find({"_id":objectId(preIdS)}).toArray()
            resolve(prevData)
            console.log(preIdS)
        })
    },
    /* Submit the complaint */
    complaintSubmission:(complaint)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.COMPLAINT_COLLECTION).insertOne(complaint).then((complaintInfo)=>{
                resolve(complaintInfo)
            })
        })
    },
    /* display the complaint */
    viewAllComplaints:()=>{
        return new Promise(async(resolve,reject)=>{
            let complaint=await db.get().collection(collection.COMPLAINT_COLLECTION).find().toArray()
            resolve(complaint)
        })
    }
}