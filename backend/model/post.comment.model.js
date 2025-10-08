import mongoose from "mongoose";
 
const commentSchema= new  mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    postId:{
        type:mongoose.Schema.ObjectId ,
        ref:"Post",
                required:true

    },
  comment:{
        type: String,
        minlenght:1,
        maxlenght:100 }

})

const commentModel = new mongoose.model('commentPost',commentSchema)

export default commentModel