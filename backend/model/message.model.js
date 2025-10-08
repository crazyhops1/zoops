import mongoose from "mongoose";

const messageSchema= new mongoose.Schema({
    conversationId:{
 type:mongoose.Types.ObjectId,
          ref: 'Connversation',
        required: true
    },
    sender:{
        type:mongoose.Types.ObjectId,
          ref: 'User',
        required: true
    },

    text:{
        type:String,
      },
       media:{
        type:String,
      },
      isRead: {
    type: Boolean,
    default: false, 
  },

},{timestamps:true})

const messageModel= new mongoose.model('Message',messageSchema)
export default messageModel