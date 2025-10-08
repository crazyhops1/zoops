import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import NavLogoBar from '../navbar/NavLogoBar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import SpacificPost from "./SpacificPost";
import maleUser from '../assets/male-user.svg'
import { api } from '../protact-route/api';

const SeeOtherUserAccount = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [onePost, setOnePost] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.post(`/user/current-user/${id}`);
        if (response.status === 200 && response.data.users.length > 0) {
          setData(response.data.users[0]);
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };
    if (id) fetchUser();
  }, [id]);

  // Fetch posts of that user
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get(`/post/get-post/${id}`);
        if (response.status === 200) {
          setPosts(response.data.posts || []);
        }
      } catch (error) {
        console.error("Error fetching user posts:", error.message);
      }
    };
    if (id) fetchPosts();
  }, [id]);

        console.log(id)

  // follow / unfollow
  const followAndUnfollow = async () => {
    if (!data) return;
    try {
      const response = await api.get(`/follow/follow-and-unfollow/${id}`);
      console.log(response.data)
      setData(prev => ({
        ...prev,
        isFollowing: response.data.isFollowing,
        followersCount: response.data.isFollowing
          ? prev.followersCount + 1
          : prev.followersCount - 1,
      }));
    } catch (error) {
      console.error("Error in follow/unfollow:", error.message);
    }
  };

  if (!data) {
    return <p className="text-center mt-5" style={{ color: "gray" }}>Loading...</p>;
  }

  return (
    <div style={{height:'100vh', overflowx:'scroll'}}>
      {/* Top Bar for Mobile */}
      <div className="d-md-none mb-3">
        <NavLogoBar />
      </div>

      <div className="d-flex">
        {/* Left Sidebar (Desktop Navbar) */}
        <div className="d-none d-md-block" style={{ flex: 2 }}>
          <Navbar />
        </div>

        {/* Main Content */}

        <div
          style={{
            
            backgroundColor: '#282828',
            color: 'white',
            borderRadius: '10px',
            padding: '1rem',
            margin: '1rem',
            flex: 10,
          }}
        >
          {/* Conditional Rendering */}
          {!onePost ? (
            <>
              {/* Profile Row */}
              <div className="d-flex align-items-center mb-3">
                <img
                  src={data.profilePic || maleUser}
                  alt="profile"
                  style={{
                    width: '6rem',
                    height: '6rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #fff',
                  }}
                />
                <div className="d-flex justify-content-around flex-grow-1 ms-4">
                  <div className="text-center">
                    <h6 className="mb-0 fw-bold">{data.postCount || posts.length}</h6>
                    <small>Posts</small>
                  </div>
                  <div className="text-center">
                    <h6 className="mb-0 fw-bold">{data.followersCount || 0}</h6>
                    <small>Followers</small>
                  </div>
                  <div className="text-center">
                    <h6 className="mb-0 fw-bold">{data.followingCount || 0}</h6>
                    <small>Following</small>
                  </div>
                </div>
              </div>

              {/* Username & Fullname */}
              <p className="mb-1 fw-bold">@{data.username || "username"}</p>
              <p className="mb-3">{data.fullName || "User Name"}</p>

              {/* Action Buttons */}
              <div className="d-flex gap-2">
                <button
                  className="btn btn-warning w-100 fw-semibold"
                  onClick={followAndUnfollow}
                >
                  {data.isFollowing ? "Unfollow" : "Follow"}
                </button>
                <Link
                  to={`/d-message/${data._id}`}
                  className="btn btn-outline-warning w-100 fw-semibold"
                >
                  Message
                </Link>
              </div>

              <hr />

              {/* Posts Grid */}
              <div className="container">
                {posts.length > 0 ? (
                  <div className="row g-3">
                    {posts.map((post, index) => (
                      <div
                        key={index}
                        className="col-6 col-md-4 col-lg-3"
                        onClick={() => setOnePost(post)}
                      >
                        {post.post ? (
                          <div className="position-relative">
                            <img
                              src={post.post}
                              alt="user-post"
                              className="img-fluid rounded"
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "278px",
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center text-center border rounded"
                            style={{
                              width: "100%",
                              height: "278px",
                              backgroundColor: "#282828",
                              color: "white",
                              fontSize: "0.9rem",
                              padding: "10px",
                            }}
                          >
                            {post.postDescription || "No description"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted mt-5">
                    <h5>No posts yet</h5>
                    <p>Start sharing your moments!</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <FontAwesomeIcon
                style={{ cursor: "pointer", fontSize: "2rem", padding: "10px" }}
                type="button"
                onClick={() => setOnePost(null)}
                icon={faArrowCircleLeft}
              />
              <SpacificPost item={onePost} />
            </div>
          )}
        </div>

        {/* Bottom Navbar for Mobile */}
        <div className="d-md-none fixed-bottom">
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default SeeOtherUserAccount;
