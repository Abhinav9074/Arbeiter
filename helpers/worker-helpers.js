var db = require('../config/connection')
var collection = require('../config/collections')
var objectId = require('mongodb').ObjectId
module.exports = {
    /* Pass all workers to users page */
    getAllWorkers: () => {
        return new Promise(async (resolve, reject) => {
            let workers = await db.get().collection(collection.APPROVED_WORKER_COLLECTION).find({ "activeStatus": "Active" }).toArray()
            resolve(workers)
            console.log(workers)
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
                    console.log(updatedData)
                })
        })
    },


    /*Worker Work Scheduler */
    workScheduler : (scheduledData)=>{
        return new Promise((resolve, reject) => {

            let response = {}
            let info= db.get().collection(collection.WORK_SCHEDULE).findOne({workerId:scheduledData.workerId})
            
            db.get().collection(collection.WORK_SCHEDULE).insertOne(scheduledData).then((data)=>{
                resolve(data.insertedId)
            })
        })

    }


}