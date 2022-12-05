var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectId
module.exports = {

    /* USER SIGNUP */
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.insertedId)
            })

        })

    },
    /* USER LOGIN */
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            if (user) {
                bcrypt.compare(userData.Password,user.Password).then((status) => {
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
            let sortData=await db.get().collection(collection.APPROVED_WORKER_COLLECTION).find({ "category": category }&&{ "place": place }).toArray()
            resolve(sortData)
        })
    }
}