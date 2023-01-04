var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
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
            let sortData=await db.get().collection(collection.APPROVED_WORKER_COLLECTION).find({ "category": category,"place": place ,"activeStatus": "Active"}).toArray()
            resolve(sortData)
        })
    }
}