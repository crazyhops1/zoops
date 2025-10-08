import imageOrVideoUploadInCloudeNary from "../middelwere/file.upload.Cloudinary.js"
import PostModel from "../model/post.model.js"
import postLike from '../model/post.like.model.js'
import commentModel from "../model/post.comment.model.js";
import followModel from "../model/follow.model.js";
import mongoose, { Types } from "mongoose";
import userModel from "../model/user.model.js";


export const uploadPost = async (request, response) => {


  const { postDescription } = request.body || {};

  const userId = request.userId

  if (request.file) {

    try {
      // Pass correct file path to Cloudinary
      const post_url = await imageOrVideoUploadInCloudeNary(request.file.path);

      if (post_url.success) {
        const upload_post_on_mongoDb = await PostModel.create({
          postDescription,
          post: post_url.message,
          userId
        });

        if (!upload_post_on_mongoDb) {
          return response.status(400).json({ message: 'something went wrong while uploading the post' });
        }

        return response.status(201).json({ message: "Post created", post: upload_post_on_mongoDb });
      } else {
        return response.status(400).json({ message: post_url.message });
      }
    } catch (error) {
      return response.status(500).json({ message: 'internal server error', error });
    }
  } else {
    if (!postDescription) {
      return response.status(400).json({ message: 'description required' });
    }

    try {
      const upload_description_on_mongodb = await PostModel.create({ postDescription, userId });

      if (!upload_description_on_mongodb) {
        return response.status(400).json({ message: 'something went wrong while uploading the description' });
      }

      return response.status(201).json({ message: "Post created", post: upload_description_on_mongodb });
    } catch (error) {
      return response.status(500).json({ message: "internal server error", error });
    }
  }
}

export const likeOrUnlikePost = async (request, response) => {
  const userId = request.userId;
  const { postId } = request.params;

  if (!userId || !postId) {
    return response
      .status(400)
      .json({ message: "post and user ids are required" });
  }

  try {
    // check post exists
    const postExist = await PostModel.findById(postId);
    if (!postExist) {
      return response.status(404).json({ message: "post not exist" });
    }

    // check if user already liked
    const checkUserLikeOnPost = await postLike.findOne({ userId, postId });

    if (checkUserLikeOnPost) {
      // unlike
      await postLike.findOneAndDelete({ postId, userId });
      return response
        .status(200)
        .json({ message: "unliked the post", liked: false });
    } else {
      // like
      await postLike.create({ postId, userId });
      return response
        .status(200)
        .json({ message: "liked the post", liked: true });
    }
  } catch (error) {
    console.error("Error in likeOrUnlikePost:", error);
    return response
      .status(500)
      .json({ message: "internal server error", error });
  }
};

export const countLikesAndComments = async (request, response) => {
  const { postId } = request.params || {}
  if (!postId) {
    return response.status(400).json({ message: "post  id is  required" })



  }
  try {
    const likesCount = await postLike.countDocuments({ postId })
    const commentsCount = await commentModel.countDocuments({ postId })
    if (!likesCount || !commentsCount) {
      return response.status(400).json({ message: "post not exist" })
    }
    return response.status(200).json({ message: "Like and comment count retrieved", likes: likesCount, comments: commentsCount })



  } catch (error) {

  }
}
export const WriteCommentOnPost = async (request, response) => {
  const userId = request.userId || {}
  const { postId } = request.params || {}
  const { comment } = request.body || {}
  if (!userId || !postId || !comment) {
    return response.status(400).json({ message: "userid and postid is required" })

  }

  try {
    const commentOnpost = await commentModel.create({
      postId,
      userId,
      comment

    })
    if (!commentOnpost) {
      return response.status(400).json({ message: "commet is to small or to large " })

    }

    return response.status(200).json({ message: "commenr send" })
  } catch (error) {
    return response.status(500).json({ message: "internal server error " })


  }

}

export const timeLinePost = async (request, response) => {
  const userId = request.userId;
  const { limit, page } =request.query




  try {

    const timelineposts = await followModel.aggregate([
      { $match: { followers: new mongoose.Types.ObjectId(userId) } },

      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "timeLinePost",
          
          
        }
      },
        { $unwind: { path: "$timeLinePost"} },
      {
        $lookup: {
          from: "users",
          localField: "timeLinePost.userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: { path: "$userDetails" } },

      {
        $lookup: {
          from: "postlikes",
          localField: "timeLinePost._id",
          foreignField: "postId",
          as: "postlikes"
        }
      },
      {
        $lookup: {
          from: "commentposts",
          localField: "timeLinePost._id",
          foreignField: "postId",
          as: "postComment"
        }
      },
      

      {
        $addFields: {
          likeCount: { $size: { $ifNull: ["$postlikes", []] } },
          commentCount: { $size: { $ifNull: ["$postComment", []] } },
          likeExist: { $in: [new mongoose.Types.ObjectId(userId), '$postlikes.userId'] }
        }
      },
      

           { $sort: { createdAt: -1 } },

      {
        $skip: (parseInt(page)-1) * parseInt(limit) 
      },
      {
        $limit: parseInt(limit) 
      },

      {
        $project: {
          _id: "$timeLinePost._id", // post ka id as _id
          userId: "$timeLinePost.userId",
          postDescription: "$timeLinePost.postDescription",
          postImage: "$timeLinePost.post",
          createdAt: "$timeLinePost.createdAt",

          username: "$userDetails.username",
          fullName: "$userDetails.fullName",
          profilePic: "$userDetails.profilePic",

          likeCount: 1,
          commentCount: 1,
          likeExist: 1
        }
      }



    ]);


    if (!timelineposts ) {
      return response.status(400).json({ message: "post not found" });
      
    }

    return response
      .status(200)
      .json({ message: "post found", timeLine: timelineposts });
  } catch (error) {
    console.error("Timeline error:", error);
    return response
      .status(500)
      .json({ message: "internal server", error: error.message });
  }
};

export const deletePost = async (request, response) => {
  const { postId } = request.params || {}
  const userId = request.userId
  if (!postId) {
    return response.status(400).json({ message: 'post id is required' })
  }
  try {
    const deletePost = await PostModel.deleteOne({ $and: [{ _id: postId }, { userId }] })
    if (!deletePost) {
      return response.status(400).json({ message: 'post not exist  required' })

    }
    await postLike.deleteMany({ postId })
    await postLike.deleteMany({ postId })
    return response.status(200).json({ message: 'post deleted' })


  } catch (error) {
    return response.status(500).json({ message: 'internal server error' })

  }

}

export const loginUserPosts = async (request, response) => {
  const userId = request.userId;

  try {
    const postDetails = await PostModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },


      { $unwind: '$userDetails' },

      {
        $lookup: {
          from: "postlikes",
          localField: "_id",
          foreignField: "postId",
          as: "postlikes"
        }
      },
      {
        $lookup: {
          from: "commentposts",
          localField: "_id",
          foreignField: "postId",
          as: "postComment"
        }
      },

      {
        $addFields: {
          likeCount: { $size: { $ifNull: ["$postlikes", []] } },
          commentCount: { $size: { $ifNull: ["$postComment", []] } },
          likeExist: { $in: [new mongoose.Types.ObjectId(userId), '$postlikes.userId'] }
        }
      },

      {
        $project: {

          _id: 1,
          postImage: "$post",
          postDescription: 1,
          username: "$userDetails.username",
          fullName: "$userDetails.fullName",
          profilePic: "$userDetails.profilePic",

          likeCount: 1,
          commentCount: 1,
          likeExist: 1
        }
      }
    ]);

    if (!postDetails || postDetails.length === 0) {
      return response
        .status(404)
        .json({ message: "No posts found for this user" });
    }

    return response.status(200).json({
      message: "Posts fetched successfully",
      posts: postDetails,
    });
  } catch (error) {
    console.error("Error in loginUserPosts:", error);
    return response.status(500).json({
      message: "Something went wrong while fetching posts",
      error: error.message,
    });
  }
};
export const allUserPost = async (request, response) => {
  const { userId } = request.params;

  try {
    const postDetails = await PostModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },


      { $unwind: '$userDetails' },

      {
        $lookup: {
          from: "postlikes",
          localField: "_id",
          foreignField: "postId",
          as: "postlikes"
        }
      },
      {
        $lookup: {
          from: "commentposts",
          localField: "_id",
          foreignField: "postId",
          as: "postComment"
        }
      },

      {
        $addFields: {
          likeCount: { $size: { $ifNull: ["$postlikes", []] } },
          commentCount: { $size: { $ifNull: ["$postComment", []] } },
          likeExist: { $in: [new mongoose.Types.ObjectId(userId), '$postlikes.userId'] }
        }
      },

      {
        $project: {

          _id: 1,
          postImage: "$post",
          postDescription: 1,
          username: "$userDetails.username",
          fullName: "$userDetails.fullName",
          profilePic: "$userDetails.profilePic",

          likeCount: 1,
          commentCount: 1,
          likeExist: 1
        }
      }
    ]);

    if (!postDetails || postDetails.length === 0) {
      return response
        .status(404)
        .json({ message: "No posts found for this user" });
    }

    return response.status(200).json({
      message: "Posts fetched successfully",
      posts: postDetails,
    });
  } catch (error) {
    console.error("Error in loginUserPosts:", error);
    return response.status(500).json({
      message: "Something went wrong while fetching posts",
      error: error.message,
    });
  }
};

