import express from'express'
import { verifyToken } from '../middelwere/protact.with.jwt.js'
import { getCurrentUserProfile, getUserProfileById, profilePicUpdation, serachUaserByUserName ,searchByAi, profileDataUpdate} from '../controller/users.controller.js'
import { uploadInMulter } from '../middelwere/file.upload.Cloudinary.js'

const userRouter=express.Router()
// for other user
userRouter.post('/current-user/:userId',verifyToken,getUserProfileById)
// for login user
userRouter.get('/current-user/me',verifyToken,getCurrentUserProfile)
// profile pic update only

userRouter.patch('/profile-pic-update',verifyToken,uploadInMulter.single('profilePic'),profilePicUpdation)
//profile data update
userRouter.patch('/update-profile-data-update',verifyToken,profileDataUpdate)
// search user by username

userRouter.post('/username/:username',verifyToken,serachUaserByUserName)

// search sotmthing with ai
userRouter.post('/get-ai-data',verifyToken,searchByAi)



export default userRouter