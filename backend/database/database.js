import mongoose from "mongoose";


 const connectToDatabase=async()=>{
 try {
     const db = await mongoose.connect(process.env.DB);
     if(db){
        return console.log("db connected")
     }
     else{
        return console.log('somthing worng in db')
     }
 } catch (error) {
    return error
 }
}
 export default  connectToDatabase

