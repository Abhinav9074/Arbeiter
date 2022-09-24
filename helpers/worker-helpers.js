var db=require('../config/connection')
var collection=require('../config/collections')
module.exports={

    addWorker:(worker,callback)=>{

        db.get().collection('worker').insertOne(worker).then((data)=>{
            callback(data.insertedId)
        })
    },
    getAllWorkers:()=>{
        return new Promise(async(resolve,reject)=>{
            let workers=await db.get().collection(collection.WORKER_COLLECTION).find().toArray()
            resolve(workers)
        })
    }
}