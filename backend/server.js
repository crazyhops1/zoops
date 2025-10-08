import express from 'express'
import 'dotenv/config'
import connectToDatabase from './database/database.js'
import authrouter from './route/auth.route.js'
import postRouter from './route/post.route.js'
import bodyParser from 'body-parser'
import followRouter from './route/follow.route.js'
import cookieParser from 'cookie-parser'
import userRouter from './route/user.route.js'
import cors from'cors'
import {app,server} from './socket-real-time-update/socket.io.js'
import messageRoute from './route/message.route.js'




app.use(cors({
    origin:process.env.FRONTENDURL,
    credentials:true,
    
}))
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cookieParser())

// api 
app.use('/zoops/auth',authrouter)
app.use('/zoops/post',postRouter)
app.use('/zoops/follow',followRouter)
app.use('/zoops/user',userRouter)
app.use('/zoops/message',messageRoute)




server.listen(process.env.PORT , (e)=>{
    if(!e){
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);   
       connectToDatabase()

    }

})