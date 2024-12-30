import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            dbName:"SocialApp"
        });
        console.log("connected to database")
    }catch(error){
        console.log(error);
    }
}