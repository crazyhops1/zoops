import { v2 as cloudinary } from 'cloudinary'
import multer from'multer'

const storage=multer.diskStorage({
    filename:(req,file,cb)=>{
      cb(null, Date.now() + '-' + file.originalname); 

    }
})
 export const uploadInMulter =multer({storage:storage})


cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.API_SECRET,
    api_key:process.env.API_KEY
})


 const imageOrVideoUploadInCloudeNary= async(imageOrVideo)=>{
    if(!imageOrVideo){
        return {message:'you want uploade you post without any image or video',success:false}
    }
    try {
        const upload=await cloudinary.uploader.upload(imageOrVideo)
        if(!upload||!upload.secure_url){
            return {message:'uplode faile' ,success:false}
        }
       return { message:upload.secure_url,success:true}
       
    } catch (error) {
                    return {message: error ,success:false}

        
    }
}


 export const deletePhotofromCloudenary =async(oldImageOrVideo,newImage)=>{
        if(!oldImageOrVideo){
        return {message:'you want update you profile without any image or video'}
    }
    try {
        const cloudeDelete= await cloudinary.uploader.destroy(oldImageOrVideo)
 if(!cloudeDelete){
     return  {message:'old Photo O rvideo delete to failed' ,success:false}
 }     
 const cloudeUpload= await cloudinary.uploader.upload(newImage)
      return  {message:cloudeUpload.secure_url ,success:true}



    } catch (error) {
             return  {message:'internal server error' ,success:false, error}

    }
}
export  default imageOrVideoUploadInCloudeNary