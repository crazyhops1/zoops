
import jwt from "jsonwebtoken";
import userModel from "../model/user.model.js";



export const verifyToken = async (request, response, next) => {
  const { zoopsaccess } = request.cookies || {};
                 
  try {
    if (!zoopsaccess) {
      return response.status(401).json({ message: "token is not provided" })

    }

    const decoded = jwt.verify(zoopsaccess, process.env.SECRET_KEY)
    if (!decoded) {

      return response.status(401).json({ message: "token is expaire " })

   }

    const chackUserPhoneIsVerifay = await userModel.findById(decoded.zoopsaccess)

    if (!chackUserPhoneIsVerifay.isVerified ) {
      return response.status(403).json({ message: "user phone number is not varify " })
      

    }


    request.userId = decoded.zoopsaccess

    return next()







  } catch (error) {
    return response.status(500).json({ message: "internal server error", error })


  }
}

export const refrashToken = (request, response) => {

  const { zoopsrefrash } = request.cookies || {}; // cookie should be not delted
  try {
  

    const decoded = jwt.verify(zoopsrefrash, process.env.SECRET_KEY)

    if(!decoded){
            return response.status(419).json({ message: "Session or auth timeout" })

    }
    // Access Token by jwt
            // Access Token by jwt
            const createToken =  jwt.sign({zoopsaccess:decoded.zoopsrefrash}, process.env.SECRET_KEY, { expiresIn: '1m' })
            //refrash Token by jwt
            const refrashToken = jwt.sign({zoopsrefrash:decoded.zoopsrefrash}, process.env.SECRET_KEY, { expiresIn: '15d' })

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

    return response.status(200).json({ message: 'user login', token: createToken })

  } catch (error) {
    return response.status(500).json({ message: "refrash token is expaire", error })


  }



}

