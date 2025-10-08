import express from'express'
import { verifyToken } from '../middelwere/protact.with.jwt.js'
import { getLastMessageWithUsers, getMessageCount, getMessageHistroy, sendMessage } from '../controller/message.controller.js'


const messageRoute=express.Router()

messageRoute.get('/get-message/:Id',verifyToken,getMessageHistroy)
messageRoute.post('/send-message',verifyToken,sendMessage)
messageRoute.get('/get-recent-chat',verifyToken,getLastMessageWithUsers)
messageRoute.get('/get-message-count',verifyToken,getMessageCount)









export default messageRoute