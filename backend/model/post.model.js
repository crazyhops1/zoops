import mongoose from "mongoose";



const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true

    },
    post: {
        type: String,
    },
    postDescription: {
        type: String,
        minlenght:10,
        maxlenght:100
    
         }

}, { timestamps: true })

const PostModel = new mongoose.model('Post', postSchema)
export default PostModel