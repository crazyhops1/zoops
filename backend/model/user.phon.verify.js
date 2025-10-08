import mongoose from "mongoose"
 

const PhoneVerifyByOtp= new mongoose.Schema({
    userID:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    otp:{
        type:String,
        require:true
    },  
    createdAt: { type: Date, default: Date.now, expires: 300 },

})
const otpverify= new mongoose.model('OtpVerify',PhoneVerifyByOtp)
export default  otpverify