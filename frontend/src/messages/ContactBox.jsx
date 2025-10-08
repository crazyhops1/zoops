import React, { useEffect, useState } from "react";
import { api } from "../protact-route/api";
import maleUser from "../assets/male-user.svg";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../context/Socket.io";
import NavLogoBar from "../navbar/NavLogoBar";
import Navbar from "../navbar/Navbar";
import { useMessageCount } from "../customHooks/customHooks";

const ContactBox = () => {
  const [conversations, setConversations] = useState([]);
  const socket = useSelector((state) => state.socket.socket);
  const loginUser = useSelector((state) => state.user.id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ custom hook for unread counts
  const messageCounts = useMessageCount();

  // fetch recent chats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/message/get-recent-chat");
        if (response.status === 200) {
          setConversations(response.data.conversations || []);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
    fetchData();
  }, []);

  // socket init
  useEffect(() => {
    if (!socket) dispatch(connectSocket());
  }, [dispatch, socket]);

  // socket listener for sidebar updates
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (msg) => {
      setConversations((prev) => {
        const idx = prev.findIndex((c) => c._id === msg.conversationId);
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx].lastMessage = msg.lastMessage;
          return updated;
        } else {
          return [
            ...prev,
            {
              _id: msg.conversationId,
              lastMessage: msg.lastMessage,
              otherUser: msg.otherUser || null,
            },
          ];
        }
      });
    };

    socket.on("updateSidebar", handleUpdate);
    return () => socket.off("updateSidebar", handleUpdate);
  }, [socket]);

  const getChatBg = (chat, loginUserId) => {
    const isMyMessage = chat?.lastMessage?.sender === loginUserId;
    if (!isMyMessage && !chat?.lastMessage?.isRead) return "#ffca2c";
    return "#555";
  };

  return (
    <div>
      <NavLogoBar />
      <div style={{ display: "flex" }}>
        <div className="d-md-block" style={{ display: "none", flex: 2 }}>
          <Navbar />
        </div>

        <div style={{ flex: 10 }}>
          <div
            className="m-1"
            style={{
              backgroundColor: "#282828",
              height: "100vh",
              overflowY: "auto",
              borderRadius: "15px",
            }}
          >
            <h4
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                padding: "10px 0",
              }}
            >
              Messages
            </h4>

            {conversations.length > 0 ? (
              conversations.map((chat) => {
                // ✅ get unread count for this conversation
                const countData = messageCounts.find(
                  (item) => item._id === chat._id
                );
                const unreadCount = countData ? countData.unreadCount : 0;

                return (
                  <div
                    key={chat._id}
                    onClick={() =>
                      navigate(`/d-message/${chat?.otherUser?._id}`)
                    }
                    className="d-flex gap-2 m-3 p-2"
                    style={{
                      backgroundColor: getChatBg(chat, loginUser),
                      minHeight: "60px",
                      borderRadius: "10px",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={chat?.otherUser?.profilePic || maleUser}
                      style={{
                        width: "3rem",
                        height: "3rem",
                        borderRadius: "50%",
                        objectFit: "cover",
    border: '2px solid',
    borderColor: chat?.otherUser?.isOnline ? 'green' : 'yellow',
                      }}
                      alt="profile"
                    />
                    <div className="d-flex flex-column">
                      <h6 className="m-0 text-dark">
                        {chat?.otherUser?.username}
                      </h6>
                      <div className="d-flex align-items-center">
                        {chat?.lastMessage?.sender === loginUser ? (
                          <small className="text-muted">you sent</small>
                        ) : (
                          <small className="text-muted">
                            {chat?.lastMessage?.text
                              ? chat.lastMessage.text.slice(0, 20) + "..."
                              : "No messages yet"}
                          </small>
                        )}

                        {/* 🔴 badge for unread count */}
                        {unreadCount > 0 && (
                          <span
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              fontSize: "0.7rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginLeft: "5px",
                            }}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-light mt-4">
                No conversations yet
              </p>
            )}
          </div>
        </div>

        <div className="d-md-none" style={{ display: "block" }}>
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default ContactBox;
