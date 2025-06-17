import mongoose from "mongoose"


const ConnectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Mongo Db connected successfully");
        
    } catch (error) {
         console.log(error);
         
    }
}

export default ConnectDb