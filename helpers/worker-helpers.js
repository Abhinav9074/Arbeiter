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

    getWorkNotification: (notiId) => {
        return new Promise(async (resolve, reject) => {
            let notification = await db.get().collection(collection.WORKER_CONTACT_COLLECTION).find({ "workerId": notiId }).toArray()
            resolve(notification)

        })
    },
    /* Worker notification details viewer */
    getWorkNotificationDetails: (contactId) => {
        return new Promise(async (resolve, reject) => {
            let contactDetails = await db.get().collection(collection.WORKER_CONTACT_COLLECTION).find({ "userId": contactId }).toArray()
            resolve(contactDetails)

        })
    },

    /* Worker Booking Rejection*/
    rejectBooking: (rejectId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.WORKER_CONTACT_COLLECTION).findOneAndDelete({ "userId": rejectId }).then((response) => {
                resolve(response)
            })
        })
    },

    /* Set Current Status To Busy */
    updateCurrentStatusToBusy: (upId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.APPROVED_WORKER_COLLECTION)
                .updateOne({ _id: objectId(upId) }, {
                    $set: {
                        currentStatus: null
                    }
                }).then((updatedCurrentData) => {
                    resolve(updatedCurrentData)
                })
        })
    },
    /* get worker details for booking confirmation */
    getSpecificWorkerDetails: (specId) => {
        return new Promise(async (resolve, reject) => {
            let specificWorkerData = await db.get().collection(collection.APPROVED_WORKER_COLLECTION).findOne({ "_id": objectId(specId) }, { projection: { _id: 0, workerName: 1, workerPincode: 1, workerPhone: 1, category: 1, workerPlace: 1, } })
            console.log(specificWorkerData)
            resolve(specificWorkerData)
        })
    },

    /* get user details for booking confirmation */

    getSpecificUserDetails: (speuId) => {
        return new Promise(async (resolve, reject) => {
            let specificUserData = await db.get().collection(collection.USER_COLLECTION).findOne({ "_id": objectId(speuId) }, { projection: { _id: 0, User_Name: 1, Email: 1 } })
            resolve(specificUserData)
        })
    },
    /* merge the user and worker data */
    mergeData: (specUserData) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CONFIRMED_BOOKING_COLLECTION).insertOne(specUserData).then((data) => {
                resolve(data.insertedId)
            })
        })
    },
    /* add the user data with worker data */
    updateMergeData: (specUserData, speDataId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CONFIRMED_BOOKING_COLLECTION).updateOne({ "_id": objectId(speDataId) }, {
                $set: {
                    User_Name: specUserData.User_Name,
                    Email: specUserData.Email
                }
            }).then((specUpData) => {
                resolve(specUpData)
            })
        })
    },

    /*delete worker notification data*/
    deleteContactData: (deleteId) => {
        console.log(deleteId)
        return new Promise((resolve, reject) => {
            db.get().collection(collection.WORKER_CONTACT_COLLECTION).findOneAndDelete({ "userId": deleteId }).then((deletData) => {
                resolve(deletData)
            })
        })
    },
    /* add user and worker id to bookings collection */
    addId: (mergeId, userId, workerId, addressAndPhone) => {
        return new Promise((resolve, reject) => {
            const d = new Date();
            let day = d.getDate();
            let year = d.getFullYear();
            let month = d.getMonth();
            let hour = d.getHours();
            let minutes = d.getMinutes();


            db.get().collection(collection.CONFIRMED_BOOKING_COLLECTION).updateOne({ "_id": objectId(mergeId) }, {
                $set: {
                    userId: userId,
                    workerId: workerId,
                    status: "ongoing",
                    day: day,
                    month: month + 1,
                    year: year,
                    hour: hour,
                    minutes: minutes,
                    userAddress: addressAndPhone.address,
                    userPhone: addressAndPhone.phone,
                    userPincode: addressAndPhone.pincode

                }
            }).then((updatedId) => {
                resolve(updatedId)
            })
        })
    },


    /* get confirmed on going works */
    getConfirmedWorkInfo: (disId) => {
        return new Promise(async (resolve, reject) => {
            let ConfirmedData = await db.get().collection(collection.CONFIRMED_BOOKING_COLLECTION).findOne({ "workerId": disId })
            resolve(ConfirmedData)
        })
    },


    /*get address and  phone of user*/
    getAddressAndPhone: (addId) => {
        return new Promise(async (resolve, reject) => {
            let AddressData = await db.get().collection(collection.WORKER_CONTACT_COLLECTION).findOne({ "userId": addId })
            resolve(AddressData)
        })
    },
    /* Update Worker Location */

    updateWorkerLocation: (locId, locData) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.CONFIRMED_BOOKING_COLLECTION).updateOne({ "_id": objectId(locId) }, {
                $set: {

                    status: locData,
                    workStatus: null,
                    userAuth: null

                }
            })
        })
    },
    /*work completed from workers side*/
    workCompleted:(comId)=>{
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.CONFIRMED_BOOKING_COLLECTION).updateOne({"_id": objectId(comId)}, {
                $set: {

                    workStatus: "true"

                }
            }).then((comData)=>{
                resolve(comData)
        })
        })
    }
}