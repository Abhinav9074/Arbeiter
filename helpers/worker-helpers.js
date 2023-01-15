var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
module.exports = {
    /* Pass all workers to users page */
    getAllWorkers: () => {
        return new Promise(async (resolve, reject) => {
            let workers = await db.get().collection(collection.APPROVED_WORKER_COLLECTION).find({ "activeStatus": "Active" }).toArray()
            resolve(workers)
            
        })
    },
    /* Pass all worker details to admin page */
    getAllWorkersAdmin: () => {
        return new Promise(async (resolve, reject) => {
            let workersForAdmin = await db.get().collection(collection.APPROVED_WORKER_COLLECTION).find().toArray()
            resolve(workersForAdmin)
        })
    },


    /* Update the activity status of Worker */
    updateActiveStatus: (updateId, data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPROVED_WORKER_COLLECTION)
                .updateOne({ _id: objectId(updateId) }, {
                    $set: {
                        activeStatus: data
                    }
                }).then((updatedData) => {
                    resolve(updatedData)
                })
        })
    },
    /* Update the current status of Worker */
    updateCurrentStatus: (currentId, currentData) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPROVED_WORKER_COLLECTION)
                .updateOne({ _id: objectId(currentId) }, {
                    $set: {
                        currentStatus: currentData
                    }
                }).then((updatedCurrentData) => {
                    resolve(updatedCurrentData)
                })
        })
    },
    /* Get Work Notification  */

   getWorkNotification:(notiId)=>{
    return new Promise(async(resolve, reject) =>{
        let notification = await db.get().collection(collection.WORKER_CONTACT_COLLECTION).find({ "workerId": notiId }).toArray()
        resolve(notification)

    })
   },
   /* Worker notification details viewer */
   getWorkNotificationDetails:(contactId)=>{
    return new Promise(async(resolve, reject) =>{
        let contactDetails = await db.get().collection(collection.WORKER_CONTACT_COLLECTION).find({ "userId": contactId }).toArray()
        resolve(contactDetails)

    })
   },

   /* Worker Booking Rejection*/
   rejectBooking:(rejectId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.WORKER_CONTACT_COLLECTION).findOneAndDelete({"userId":rejectId}).then((response)=>{
            resolve(response)
        })
   })
   },

   /* Set Current Status To Busy */
   updateCurrentStatusToBusy:(upId)=>{
    return new Promise((resolve,reject)=>{
        let upData=null
        db.get().collection(collection.APPROVED_WORKER_COLLECTION)
        .updateOne({ _id: upId }, {
            $set: {
                currentStatus:upData
            }
        }).then((updatedCurrentData) => {
            resolve(updatedCurrentData)
        })
    })
   }
}