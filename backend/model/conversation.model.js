import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    members: [ { type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
},{timestamps:true})
const conversationModel= new mongoose.model('Connversation',conversationSchema)
export default conversationModel