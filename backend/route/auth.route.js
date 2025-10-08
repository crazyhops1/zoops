import express from 'express'
import { login, logOut, phoneNumberVerify, signup } from '../controller/auth.js'
import { refrashToken, verifyToken } from '../middelwere/protact.with.jwt.js'

const authrouter =express.Router()
authrouter.post('/signup',signup)
authrouter.post('/login',login)
authrouter.post('/otpverify',phoneNumberVerify)
authrouter.post('/logOut',logOut)
authrouter.get('/refrash',refrashToken)

export default authrouter