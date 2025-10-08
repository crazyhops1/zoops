import mongoose from "mongoose";
 
const likeSchema= new  mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    postId:{
        type:mongoose.Schema.ObjectId ,
        ref:'Post'
    }
})

const postLike = new mongoose.model('PostLike',likeSchema)

export default postLike