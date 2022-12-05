var db=require('../config/connection')
var collection=require('../config/collections')
module.exports={
    
    getAllWorkers:()=>{
        return new Promise(async(resolve,reject)=>{
            let workers=await db.get().collection(collection.APPROVED_WORKER_COLLECTION).find().toArray()
            resolve(workers)
        })
    }
}