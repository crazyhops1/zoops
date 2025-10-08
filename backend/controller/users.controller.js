import mongoose from "mongoose"
import userModel from "../model/user.model.js"
import imageOrVideoUploadInCloudeNary, { deletePhotofromCloudenary } from "../middelwere/file.upload.Cloudinary.js"
import { askSomthing } from "../ai_tools/Search.ai.js"
//  profile by user id
export const getUserProfileById = async (request, response) => {
    const { userId } = request.params
    const loginUserId = request.userId
    if (!userId) {
        return response.status(400).json({ message: 'user id is required' })
    }


    try {

        const users = await userModel.aggregate([{ $match: { _id: new mongoose.Types.ObjectId(userId) } },

        // People who follow YOU
        {
            $lookup: {
                from: 'follows',
                localField: '_id',
                foreignField: 'following',

                as: 'followers'
            }
        },

        // People YOU follow
        {
            $lookup: {
                from: 'follows',
                localField: '_id',
                foreignField: 'followers',
                as: 'following'
            }
        },

        {
            $lookup: {
                from: 'posts',
                localField: '_id',
                foreignField: 'userId',
                as: 'post'


            }

        },


        {
            $addFields: {
                followersCount: { $size: "$followers" },
                followingCount: { $size: "$following" },
                postCount: { $size: "$post" },
                isFollowing: {
                    $in: [
                        new mongoose.Types.ObjectId(loginUserId),
                        "$followers.followers",
                    ],
                },
            }
        },

        {
            $project: {
                _id: 1,
                username: 1,
                fullName: 1,
                bio: 1,
                profilePic: 1,
                website: 1,
                gender: 1,
                followersCount: 1,
                followingCount: 1,
                postCount: 1,
                isFollowing: 1

            }
        }
        ])

        if (!users || users.length <= 0) {
            return response.status(404).json({ message: 'data not found' })
        }

        return response.status(200).json({
            message: 'account found',
            users,

        })

    } catch (error) {
        return response.status(500).json({ message: 'internal server error', error })
    }
}
//user profile BY jwt its me
export const getCurrentUserProfile = async (request, response) => {
    const userId = request.userId
    if (!userId) {
        return response.status(400).json({ message: 'user id is required' })
    }

    try {

        const users = await userModel.aggregate([{ $match: { _id: new mongoose.Types.ObjectId(userId) } },

        // People who follow YOU
        {
            $lookup: {
                from: 'follows',
                localField: '_id',
                foreignField: 'following',
                as: 'followers'
            }
        },

        // People YOU follow
        {
            $lookup: {
                from: 'follows',
                localField: '_id',
                foreignField: 'followers',
                as: 'following'
            }
        },
        {
            $lookup: {
                from: 'posts',
                localField: '_id',
                foreignField: 'userId',
                as: 'posts'
            }
        },

        {
            $addFields: {
                followersCount: { $size: "$followers" },
                followingCount: { $size: "$following" },
                postCount: { $size: "$posts" },


            }
        },

        {
            $project: {
                _id: 1,
                username: 1,
                fullName: 1,
                bio: 1,
                profilePic: 1,
                website: 1,
                gender: 1,
                followersCount: 1,
                followingCount: 1,
                postCount: 1

            }
        }
        ])

        if (!users || users.length <= 0) {
            return response.status(404).json({ message: 'data not found' })
        }

        return response.status(200).json({
            message: 'account found',
            users,

        })

    } catch (error) {
        return response.status(500).json({ message: 'internal server error', error })
    }
}
//update profile pic 
export const profilePicUpdation = async (request, response) => {
    if (!request.file) {
        return response.status(400).json({ message: "image not found" });
    }

    try {
        const userId = request.userId;
        const userFind = await userModel.findById(userId);

        let uploadStatus;

        // request.file se direct path lo
        const filePath = request.file.path;

        if (!userFind.profilePic || userFind.profilePic === "") {
            // agar pehli baar upload kar rahe ho
            uploadStatus = await imageOrVideoUploadInCloudeNary(filePath);
        } else {
            // agar pehle se pic hai to purani delete karke nayi upload
            uploadStatus = await deletePhotofromCloudenary(userFind.profilePic, filePath);
        }

        if (uploadStatus.success) {
            await userModel.findByIdAndUpdate(userId, { profilePic: uploadStatus.message });
            return response.status(200).json({ message: "profile pic updated" });
        } else {
            return response.status(400).json({ message: "failed to update profile pic" });
        }
    } catch (error) {
        return response.status(500).json({ message: "internal server error", error });
    }
};

// update bio or name or gender

 export const profileDataUpdate=async(request, response)=>{
    let{bio,gender,fullName}=request.body;
    const userId=request.userId;
    bio=bio?.trim()
    gender=gender?.trim()
    fullName=fullName?.trim()
    try {
        console.log(bio)
        console.log(gender)
        console.log(fullName)
        const data=await userModel.findOneAndUpdate({_id:userId},{bio,gender,fullName})
        if(!data){
            return response.status(404).json({message: "User not found"})

        }
       return response.status(200).json({message: "Profile updated successfully",data})
    } catch (error) {
                    return response.status(500).json({message: "intenal server error",error})

    }
}
// serach user by user name

export const serachUaserByUserName = async (request, response) => {
    const { username } = request.params || {};
    if (!username) {
        return response.status(400).json({ message: 'username is required' });
    }

    try {


        // Search users
        const findusers = await userModel.find(
            { username: { $regex: username, $options: 'i' } },
            { profilePic: 1, username: 1, _id: 1 }
        ).limit(10);



        return response.status(200).json({ message: 'Users found', users: findusers || [] });
    } catch (error) {
        return response.status(500).json({ message: 'Internal server error', error });
    }
};

// search by ai 

export const searchByAi = async (request, response) => {
    const { question } = request.body
    if(!question){
        return response.status(400).json({message: "No AI response found"})
    }
    try {
        const ai = await askSomthing(question)
        if (!ai || !ai.candidates || ai.candidates.length === 0) {
            return response
                .status(404)
                .json({ message: "No AI response found", ai: null });
        }
        const text = ai.candidates[0]?.content?.parts?.[0]?.text || "";
        return response.status(200).json({
            message: "AI response found",
            ai: { text },
        });

    } catch (error) {

    }

}


