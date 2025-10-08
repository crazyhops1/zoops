import express from'express'
import { followTheUser, yourFollowerList, yourFollowingList } from '../controller/follow.controller.js'
import { verifyToken } from '../middelwere/protact.with.jwt.js'


const followRouter=express.Router()

followRouter.get('/follow-and-unfollow/:following',verifyToken,followTheUser)
followRouter.get('/followersList/:userId',verifyToken,yourFollowerList)
followRouter.get('/followingList/:userId',verifyToken,yourFollowingList)





export default followRouter