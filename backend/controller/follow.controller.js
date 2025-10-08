import mongoose from "mongoose"
import followModel from "../model/follow.model.js"
import userModel from "../model/user.model.js"



export const followTheUser = async (request, response) => {
  try {
    const followers = request.userId;
    const { following } = request.params;

   
    if (!followers || !following) {
      return response.status(400).json({ message: "Both follower and following IDs are required" });
    }

    if (followers.toString() === following.toString()) {
      return response.status(400).json({ message: "You cannot follow yourself" });
    }


    console.log(followers, following)
    const existingFollow = await followModel.findOne({followers,following});

    if (existingFollow) {
      await followModel.deleteOne({ _id: existingFollow._id });
      return response.status(200).json({ message: "Unfollowed successfully", isFollowing: false });
    } else {
      await followModel.create({ followers, following });
      return response.status(200).json({ message: "Followed successfully", isFollowing: true });
    }
  } catch (error) {
    console.error("❌ Follow error:", error);
    return response.status(500).json({ message: "Internal server error", error: error.message });
  }
};





export const yourFollowerList = async (request, response) => {
  const { userId } = request.params || {};
  const {limit,page}=request.query
  if (!userId) {
    return response.status(400).json({ message: "User id is required" });
  }

  try {
    const followers = await followModel.aggregate([
      { $match: { following: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "followerDetails"
        }
      },
      { $unwind: "$followerDetails" }, // array ko flat karne ke liye
      {
        $skip:(parseInt(page)-1)*parseInt(limit)
      },
       {
        $limit:parseInt(limit)
      },
      {
        $project: {
          _id: "$followerDetails._id",
          username: "$followerDetails.username",
          fullName: "$followerDetails.fullName",
          profilePic: "$followerDetails.profilePic"
        }
      }
    ]);

    if (!followers || followers.length === 0) {
      return response.status(404).json({ message: "No followers found" });
    }

    return response.status(200).json({ message: "Followers found", followers });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ message: "Internal server error", error });
  }
};

export const yourFollowingList = async (request, response) => {
  const { userId } = request.params;
    const {limit,page}=request.query

  if (!userId) {
    return response.status(400).json({ message: "User id is required" });
  }

  try {
    const following = await followModel.aggregate([
      { $match: { followers: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "followingDetails" 
        }
      },
      { $unwind: "$followingDetails" },
        {
        $skip:(parseInt(page)-1)*parseInt(limit)
      },
       {
        $limit:parseInt(limit)
      },
      {
        $project: {
          _id: "$followingDetails._id",
          username: "$followingDetails.username",
          fullName: "$followingDetails.fullName",
          profilePic: "$followingDetails.profilePic"
        }
      }
    ]);

    return response
      .status(200)
      .json({ message: "Following list found", following });
  } catch (error) {
    console.error(error);
    return response
      .status(500)
      .json({ message: "Internal server error", error });
  }
};




