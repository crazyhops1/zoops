import express from'express'
import { uploadInMulter } from '../middelwere/file.upload.Cloudinary.js'
import { allUserPost, countLikesAndComments, deletePost, likeOrUnlikePost, loginUserPosts, timeLinePost, uploadPost, WriteCommentOnPost } from '../controller/post.controller.js'
import { verifyToken } from '../middelwere/protact.with.jwt.js'

const postRouter=express.Router()
postRouter.post('/postUpload', verifyToken,uploadInMulter.single('post'),uploadPost)
postRouter.post('/likeAndUnLike/:postId',verifyToken,likeOrUnlikePost)
postRouter.post('/count-post-like-or-comment/:postId',verifyToken,countLikesAndComments)
postRouter.post('/comment-on-post/:postId',verifyToken,WriteCommentOnPost)
postRouter.get('/timeline',verifyToken,timeLinePost)
postRouter.get('/delete-post',verifyToken,deletePost)
postRouter.get('/get-post-login-user',verifyToken,loginUserPosts)
postRouter.get('/get-post/:userId',verifyToken,allUserPost)





export default postRouter