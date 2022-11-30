var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectId
module.exports = {
    doWorkerSignup: (workerData) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.WORKER_DETAILS_COLLECTION).insertOne(workerData).then((data) => {
                resolve(data.insertedId)
            })

        })

    },
    getWorkerDetaials: () =>{
        return new Promise(async(resolve,reject)=>{
            let workerDetails=await db.get().collection(collection.WORKER_DETAILS_COLLECTION).find().toArray()
            resolve(workerDetails)
        })
    
    },
    /* Woker Deatils Passes to notifications tab in admin panel */

    getWorkerSignupDetails:(workerId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORKER_DETAILS_COLLECTION).findOne({_id:objectId(workerId)}).then((workerData)=>{
                resolve(workerData)
                console.log(workerData);
            })
        })
    },
    /* WORKER APPLICATION REJECTION FUNCTION */
    deleteWorkerApplication:(workerId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORKER_DETAILS_COLLECTION).findOneAndDelete({_id:objectId(workerId)}).then((response)=>{
                resolve(response)
            })
        })
    }


}