import bcrypt from 'bcrypt'
import userModel from '../model/user.model.js';
import otpSend from '../middelwere/otp.sender.js';
import otpCheck from '../middelwere/otp.verify.js';
import jwt from 'jsonwebtoken';
import otpverify from '../model/user.phon.verify.js';

// create account process
export const signup = async (request, response) => {

    const { username, email, password, fullName } = request.body
    if (!username || !email || !password || !fullName) {
        return response.status(400).json({ message: 'all feild are required' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {
        return response.status(400).json({ message: 'invaild email id' })
    }

    if (password.lenght < 8) {
        return response.status(400).json({ message: 'password too small' })

    }
    try {
        console.log(1)
        const chackUserNameIsExist = await userModel.findOne({ username })
                console.log(2)

        const chackUserEmail = await userModel.findOne({ email })
        console.log(3)

        if (chackUserNameIsExist) {
            return response.status(409).json({ message: ' username is already use in other account' })
        }
                console.log(4)

        if (chackUserEmail) {
            return response.status(422).json({ message: 'mobile number  is already use in other account' })
        }
                console.log(5)


        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        console.log(6)




        // here otp sending on phone code
        const chackOtpSend = await otpSend(email)
        if (!chackOtpSend.success) {
            return response.status(400).json({ message: 'somthing went worng while sanding otp' })

        }
                console.log(7)

        const newUser = await userModel.create({ fullName, email, username, password: hashPassword })
        console.log(8)


        return response.status(201).json({ message: 'account created but mobile verify is left', id: newUser._id })






    } catch (error) {
        return response.status(500).json({ message: 'somthing went worng', error })

    }



}

export const phoneNumberVerify = async (request, response) => {
    const { otp, email } = request.body
    if (!otp || !email) {
        return response.status(400).json({ message: "otp  or user id is not found" })

    }
    try {
        const output = await otpCheck(otp, email)
        if (!output) {
            return response.status(400).json({ message: 'otp is worng' })
        }

        return response.status(200).json({ message: 'user verify' })




    } catch (error) {
        return response.status(500).json({ message: "internal server error" })

    }
}


// login process
export const login = async (request, response) => {
    const { username, password } = request.body || {}
    if (!username || !password) {
        return response.status(400).json({ message: 'username or password is empty' })
    }

   
    try {
        const chackUserIsExist = await userModel.findOne({ username })

        if (!chackUserIsExist) {
            return response.status(404).json({ message: 'user not exist' })

        }
        const chack_Password_Is_Correct = bcrypt.compare(password, chackUserIsExist.password)
        if (!chack_Password_Is_Correct) {
            return response.status(400).json({ message: 'password not match' })
        }

        if (!chackUserIsExist.isVerified) {
            otpSend(chackUserIsExist.email)
            return response.status(403).json({ message: "Please verify OTP first", email: chackUserIsExist.email })
        }


        // Access Token by jwt
        const createToken = jwt.sign({zoopsaccess: chackUserIsExist._id }, process.env.SECRET_KEY, { expiresIn: '1m' })
        //refrash Token by jwt
        const refrashToken = jwt.sign({zoopsrefrash: chackUserIsExist._id }, process.env.SECRET_KEY, { expiresIn: '30d' })


        response.cookie('zoopsrefrash', refrashToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true,
            secure: process.env.ENVIRONMENT === 'production',
            sameSite: "None"
        })
        response.cookie('zoopsaccess', createToken, {
            maxAge: 1 * 60 * 1000, httpOnly: true,
            secure: process.env.ENVIRONMENT === 'production',
            sameSite: "None"

        })

        return response.status(200).json({ message: 'user login', token: createToken, id: chackUserIsExist._id })


    } catch (error) {
        return response.status(500).json({ message: 'internal server error', error })

    }

}
// log out

export const logOut = (request, response) => {
    if (!request.cookies.zoopsrefrash) {
        return response.status(200).json({ message: "No active session" });
    }

    response.clearCookie("zoopsrefrash", {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "production",
        sameSite: "None",
        path: "/", // make sure this matches cookie set path
    });

    response.clearCookie("zoopsaccess", {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "production",
        sameSite: "None",
        path: "/",
    });

    return response.status(200).json({ message: "Logged out successfully" });
};



