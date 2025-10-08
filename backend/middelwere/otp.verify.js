
import userModel from "../model/user.model.js"
import otpverify from "../model/user.phon.verify.js"

const otpCheck = async (otp, email) => {

    try {

        const findUserIdByemail = await userModel.findOne({ email }, { _id: 1, })
        const userID=findUserIdByemail._id.toString()

        const checkYouPhoneSendedOtp = await otpverify.findOne({ userID, otp})
        if (!checkYouPhoneSendedOtp) {
            return false
        }

        if (!checkYouPhoneSendedOtp) {
            return false}
     
        
        const chackUserPhoneIsVerify = await userModel.findByIdAndUpdate(userID,
            { isVerified: true },
            { new: true } )
            if(!chackUserPhoneIsVerify){
                return false
            }
            const deleteOldOtp= await otpverify.deleteMany({ userID })
        if(!deleteOldOtp){
            return false
        }
            return true
    } catch (error) {
        return error

    }

}
export default otpCheck