import mongoose, { set } from "mongoose";
import conversationModel from "../model/conversation.model.js";
import messageModel from "../model/message.model.js";
import userModel from "../model/user.model.js";
import { io, onlineUser } from "../socket-real-time-update/socket.io.js";
import { messageToenglish } from "../ai_tools/Search.ai.js";

export const sendMessage = async (req, res) => {

    const sender = req.userId;
    let { media, text, receiver, conversationId } = req.body;

    try {
        if (!conversationId) {
            const checkLastConversation = await conversationModel.findOne({
                members: { $all: [sender, receiver] },
            });

            if (checkLastConversation) {
                conversationId = checkLastConversation._id;
            } else {
                const newConversation = await conversationModel.create({
                    members: [sender, receiver],
                });
                conversationId = newConversation._id;
            }
        }
        // let inEnglishForm;
        // if (text) {

        //     inEnglishForm = await messageToenglish(text)
        // }

        const newMessage = await messageModel.create({
            conversationId,
            media,
            text: text,
            sender,
        });
        const conversationCount = await conversationModel.aggregate([
            {
                $match: { members: { $in: [new mongoose.Types.ObjectId(sender)] } }
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "conversationId",
                    as: "messages",
                    pipeline: [
                        {
                            $match: {
                                isRead: false,
                                $expr: { $eq: ["$sender", new mongoose.Types.ObjectId(sender)] }
                            }
                        }
                    ]

                }
            },

            {
                $addFields: {
                    unreadCount: { $size: "$messages" } // directly count matched messages
                }
            },
            {
                $project: {
                    _id: 1,
                    unreadCount: 1
                }
            }
        ]);


        const updatedConversation = await conversationModel.findByIdAndUpdate(
            conversationId,
            { lastMessage: newMessage._id },
            { new: true }
        );

        const receiverIndex = onlineUser.findIndex((item) => item.userid === receiver);
        if (receiverIndex !== -1) {
            io.to(onlineUser[receiverIndex].socketId).emit("receiveMessage", newMessage);
        }

        const senderIndex = onlineUser.findIndex((item) => item.userid === sender);
        if (senderIndex !== -1) {
            io.to(onlineUser[senderIndex].socketId).emit("receiveMessage", newMessage);
        }

        if (receiverIndex !== -1) {
            io.to(onlineUser[receiverIndex].socketId).emit("updateSidebar", {
                conversationId,
                lastMessage: newMessage,
            });
        }
        if (senderIndex !== -1) {
            io.to(onlineUser[senderIndex].socketId).emit("updateSidebar", {
                conversationId,
                lastMessage: newMessage,
            });
        }
        if (receiverIndex !== -1) {
            console.log(conversationCount)
            io.to(onlineUser[receiverIndex].socketId).emit("updateCounts", {
                conversationCount
            });
        }









        return res.status(201).json({
            message: "Message sent successfully",
            newMessage,
            conversation: updatedConversation,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};



export const getLastMessageWithUsers = async (req, res) => {
  const sender = req.userId;

  try {
    // --- 1️⃣ Fetch all conversations of current user ---
    const conversations = await conversationModel.aggregate([
      {
        $match: {
          members: { $all: [new mongoose.Types.ObjectId(sender)] },
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessage",
        },
      },
      {
        $unwind: {
          path: "$lastMessage",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          members: 1,
          "lastMessage._id": 1,
          "lastMessage.text": 1,
          "lastMessage.media": 1,
          "lastMessage.createdAt": 1,
          "lastMessage.sender": 1,
          "lastMessage.isRead": 1,
        },
      },
      { $sort: { "lastMessage.createdAt": -1 } },
    ]);

    // --- 2️⃣ Attach other user data & online status ---
    const result = await Promise.all(
      conversations.map(async (conv) => {
        // find the other member (not the sender)
        const otherUserId = conv.members
          .map((m) => m.toString())
          .find((id) => id !== sender);

        if (!otherUserId) return null;

        // fetch other user's info (use lean for plain object)
        const otherUser = await userModel.findById(otherUserId, {
          username: 1,
          profilePic: 1,
          fullName: 1,
        }).lean();

        if (!otherUser) return null;

        // determine online status
        const isOnline = onlineUser.some(
          (item) => item.userid === otherUserId
        );

        return {
          ...conv,
          otherUser: {
            ...otherUser,
            isOnline,
          },
        };
      })
    );

    // remove nulls
    const filteredResult = result.filter(Boolean);

    return res.status(200).json({
      message: "Fetched conversations successfully",
      conversations: filteredResult,
    });
  } catch (error) {
    console.error("❌ Error in getLastMessageWithUsers:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};




export const getMessageHistroy = async (req, res) => {
    const { Id } = req.params; // Other user ID
    const loginUserId = req.userId; // Logged-in user ID

    try {
        // Get other user details
        const otherUser = await userModel.findById(Id, {
            fullName: 1,
            username: 1,
            profilePic: 1,
        });

        if (!otherUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find existing conversation
        const conversation = await conversationModel.findOne({
            members: { $all: [Id, loginUserId] },
        });

        if (!conversation) {
            return res.status(200).json({
                message: "No conversation yet, start new chat",
                history: [],
                userDetails: otherUser,
            });
        }

        //Mark all messages from the other user as read
        await messageModel.updateMany(
            { conversationId: conversation._id, sender: Id },
            { $set: { isRead: true } }
        );

        // Get all messages in the conversation
        const history = await messageModel
            .find({ conversationId: conversation._id })
            .sort({ createdAt: 1 });

        return res.status(200).json({
            message:
                history.length > 0
                    ? "Conversation fetched successfully"
                    : "No conversation yet, start new chat",
            history,
            userDetails: otherUser,
            conversationId: conversation._id,
        });
    } catch (error) {
        console.error("Error in getMessageHistroy:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};



export const getMessageCount = async (req, res) => {
    const userId = req.userId;

    try {

        const conversationCount = await conversationModel.aggregate([
            {
                $match: { members: { $in: [new mongoose.Types.ObjectId(userId)] } }
            },
            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "conversationId",

                    as: "messages",
                    pipeline: [
                        {
                            $match: {
                                isRead: false,
                                $expr: { $ne: ["$sender", new mongoose.Types.ObjectId(userId)] }
                            }
                        }
                    ]



                }
            },
      
            {
                $addFields: {
                    unreadCount: { $size: ["$messages"] }
                }
            },
           
            {
                $project: {
                    _id:1,
                    unreadCount: 1,
                
                
                    
                }
            }
        ]);



        console.log(conversationCount)
        return res.status(200).json({
            success: true,
            data: conversationCount
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};


