import React, { useEffect, useState, useRef } from "react";
import maleUser from "../assets/male-user.svg";
import startChat from "../assets/start-chat.svg";
import { faPaperPlane, faPhone, faVideoCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { api } from "../protact-route/api";
import { connectSocket } from "../context/Socket.io";
import NavLogoBar from "../navbar/NavLogoBar";
import Navbar from "../navbar/Navbar";

const ChatBox = () => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const { profilePic, fullName, _id: myId } = useSelector((state) => state.user);
  const { id } = useParams();

  const [userProfile, setUserProfile] = useState({});
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!socket) dispatch(connectSocket());
  }, [dispatch, socket]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/message/get-message/${id}`);
        if (response.status === 200) {
          setUserProfile(response.data.userDetails);
          setMessages(response.data.history || []);
          setConversationId(response.data.conversationId || "");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, conversationId]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setLoading(true);

    const messageData = {
      conversationId,
      receiver: id,
      text,
      sender: myId,
    };

    try {
      const response = await api.post("/message/send-message", messageData);
      if (response.status === 200) {
        setMessages((prev) => [...prev, response.data.newMessage]);
        setText("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setText('')
      setLoading(false);
    }
  };
  return (
    <div>
      <NavLogoBar />

      <div style={{ display: 'flex' }}>
        <div className='d-md-block' style={{ display: "none", flex: 2 }}>
          <Navbar />
        </div>
        <div style={{flex:10, overflowX:"scroll"}}>
          <div
            className="pb-5 mb-4"
            style={{ backgroundColor: "#282828", borderRadius: "10px", height: "100vh", display: "flex", flexDirection: "column" }}
          >
            <div className="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={userProfile.profilePic || maleUser}
                  style={{ width: "3rem", height: "3rem", borderRadius: "50%" }}
                  alt="chat-user"
                />
                <h5 className="mb-0 text-white">{userProfile.username}</h5>
              </div>
              <ul className="d-flex gap-3 m-0 p-0" style={{ listStyle: "none" }}>
                <li>
                  <FontAwesomeIcon icon={faPhone} className="text-white" style={{ cursor: "pointer" }} />
                </li>
                <li>
                  <FontAwesomeIcon icon={faVideoCamera} className="text-white" style={{ cursor: "pointer" }} />
                </li>
              </ul>
            </div>

            <div className="flex-grow-1 p-3" style={{ overflowY: "auto", color: "white", backgroundColor: "transparent" }}>
              {messages.length === 0 ? (
                <div className="d-flex flex-column align-items-center justify-content-center h-100">
                  <img src={startChat} alt="start chat" style={{ width: "150px" }} />
                  <p className="text-secondary mt-3">Start a new conversation</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-2 mb-2 rounded ${msg.sender === id ? "" : "ms-auto"}`}
                    style={{
                      width: "18rem",
                      backgroundColor: msg.sender === id ? "#555" : "#ffc107",
                    }}
                  >
                    {msg.text}
                  </div>
                ))
              )}
              {loading && (
                <div className="d-flex justify-content-center mt-2">
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Sending...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="p-2 border-top border-secondary">
              <div className="d-flex align-items-center gap-2" style={{ backgroundColor: "#1f1f1f", borderRadius: "10px", padding: "0.5rem" }}>
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="me"
                    style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <span
                    style={{
                      backgroundColor: "red",
                      fontSize: "1.2rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "50%",
                      textTransform: "uppercase",
                      color: "white",
                    }}
                  >
                    {fullName ? fullName[0] : "?"}
                  </span>
                )}
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-grow-1 p-2 border-0"
                  style={{ borderRadius: "5px", backgroundColor: "transparent", color: "white", outline: "none" }}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={loading}
                />
                <button
                  className="btn btn-warning d-flex align-items-center justify-content-center"
                  style={{ borderRadius: "50%", width: "40px", height: "40px" }}
                  onClick={handleSend}
                  disabled={!text.trim() || loading}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </div>
          <div className='d-md-none' style={{ display: "block" }}>
            <Navbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
