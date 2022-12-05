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
    },
      /* WORKER APPLICATION APPROVAL FUNCTION */
      getApprovedWorkerDetails:(approvedWorker)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORKER_DETAILS_COLLECTION).findOne({_id:objectId(approvedWorker)}).then((approvedWorkerData)=>{
                resolve(approvedWorkerData)
            })
        })
    },
    /* Approved Workers are moved to a saperate collection */
    addApprovedWorker: (approvedWorkerData) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.APPROVED_WORKER_COLLECTION).insertOne(approvedWorkerData).then((data) => {
                resolve(data.insertedId)
            })

        })
    /* Approved Workers are deleted from the old collection */
    },
    deleteApprovedWorker: (approvedWorker)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.WORKER_DETAILS_COLLECTION).findOneAndDelete({_id:objectId(approvedWorker)}).then((deletedWorker)=>{
                resolve(deletedWorker)
            })
        }) 
    },
    /* WORKER PASSWORD SETTING FUNCTION */
    setWorkerPassword:(passId,pass)=>{
        return new Promise(async(resolve,reject)=>{
            pass = await bcrypt.hash(pass, 10)
           db.get().collection(collection.APPROVED_WORKER_COLLECTION)
           .updateOne({_id:objectId(passId)},{
            $set:{
                workerPassword:pass
            }
           }).then((response)=>{
            resolve()
           })
        })
    },

    /* Worker Login */

    doWorkerLogin: (loginData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}
            let worker=await db.get().collection(collection.APPROVED_WORKER_COLLECTION).findOne({email:loginData.email})
            if (worker) {
                bcrypt.compare(loginData.password,worker.workerPassword).then((status) => {
                    if (status) {
                        console.log("login-success");
                        response.worker=worker
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
    /* Delete Worker Details */
    deleteWorkerDetails:(workerId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.APPROVED_WORKER_COLLECTION).findOneAndDelete({_id:objectId(workerId)}).then((response)=>{
                resolve(response)
            })
        })
    }


   
}