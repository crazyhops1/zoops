import React, { useState } from "react";
import maleUser from '../assets/male-user.svg'
import {
  faComment,
  faHeart,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { api } from "../protact-route/api";

const SpacificPost = ({ item }) => {
  const [comment, setComment] = useState("");
  const [data, setData] = useState(item);
  const { profilePic, fullName } = useSelector((state) => state.user);

  // Like/Unlike Post
  const likeThePost = async (postId) => {
    try {
      const response = await api.post(`post/likeAndUnLike/${postId}`);
      if (response.status === 200) {
        setData((prevData) => ({
          ...prevData,
          likeExist: response.data.liked,
          likeCount: response.data.liked
            ? prevData.likeCount +1
            : prevData.likeCount - 1,
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  // Comment on post
  const commentOnPost = async (postId) => {
    try {
      const response = await api.post(`post/comment-on-post/${postId}`, {
        comment: comment,
      });
if(response.status===200){
    setData((prev)=>({
        ...prev,
        commentCount:+1
    }))
}      setComment(""); // clear input after comment
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  return (
  <div
  className="card text-light mb-3"
  style={{
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  }}
>
  {/* Profile Section */}
  <div className="d-flex align-items-center p-2">
    {data.profilePic ? (
      <img
        src={data.profilePic}
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          objectFit: "cover",
        }}
        alt="profile"
      />
    ) : (
      <span
        className="bg-warning text-dark d-flex align-items-center justify-content-center"
        style={{
          fontSize: "1.2rem",
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          fontWeight: "bold",
        }}
      >
        {data.fullName?.[0] || "?"}
      </span>
    )}
    <h6 className="ms-2 mb-0">{data.username}</h6>
  </div>

  {/* Post Image / Description */}
  {data.postImage ? (
    <div
      style={{
        width: "100%",
        maxHeight: "500px",
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <img
        src={data.postImage}
        alt="post"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // 🔑 cover instead of contain
        }}
      />
    </div>
  ) : (
    <div className=" text-center">{data.postDescription}</div>
  )}

  {/* Actions */}
  <div className="d-flex justify-content-between align-items-center px-3 py-2">
    <div className="d-flex gap-3 align-items-center">
      <FontAwesomeIcon
        icon={faHeart}
        style={{ cursor: "pointer", fontSize: "1.3rem" }}
        onClick={() => likeThePost(data._id)}
        className={data.likeExist ? "text-danger" : ""}
      />
      <small>{data.likeCount || ""}</small>
      <FontAwesomeIcon
        icon={faComment}
        style={{ cursor: "pointer", fontSize: "1.3rem" }}
      />
      <small>{data.commentCount || ""}</small>

      <FontAwesomeIcon
        icon={faPaperPlane}
        style={{ cursor: "pointer", fontSize: "1.3rem" }}
      />
    </div>
    <button className="btn btn-sm btn-outline-warning">Save</button>
  </div>

  {/* Comment Box */}
  <div className="d-flex align-items-center border-top px-3 py-2">
    {profilePic ? (
      <img
        src={profilePic}
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          objectFit: "cover",
        }}
        alt="me"
      />
    ) : (
      <span
        className="bg-danger text-light d-flex align-items-center justify-content-center"
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          fontSize: "1rem",
        }}
      >
        {fullName?.[0] || "?"}
      </span>
    )}

    <input
      type="text"
      placeholder="Write a comment..."
      className="form-control mx-2"
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      style={{
        backgroundColor: "transparent",
        color: "white",
        borderRadius: "20px",
      }}
    />

    <FontAwesomeIcon
      icon={faPaperPlane}
      className="text-warning"
      style={{ cursor: "pointer" }}
      onClick={() => commentOnPost(data._id)}
    />
  </div>
</div>

  );
};

export default SpacificPost;
