import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import Profile from "./Profile";
import { useDispatch } from "react-redux";
import { setUserProfileUpdate } from "../context/UserSlice";
import NavLogoBar from "../navbar/NavLogoBar";
import SpacificPost from "./SpacificPost";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import postNotFound from '../assets/postNotFound.svg'
import { api } from "../protact-route/api";


const UserProfile = () => {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();
  const [onePost, setOnePost] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("post/get-post-login-user");
        if (response.status === 200) {
          setPosts(response.data.posts || []);
          setError(false)
        }
      } catch (error) {
        setError(true)
      }
    };

    fetchData();
    dispatch(setUserProfileUpdate({ profileUpdate: Date.now() }));
  }, [dispatch]);

  return (
    <div >
      <div className="d-md-none" style={{ display: "block" }}>
        <NavLogoBar />
      </div>

      <div
        className="d-flex"
        style={{ height: "100vh",  }}
      >
        {/* Left Sidebar */}
        <div className="d-none d-md-block" style={{ flex: 2 }}>
          <Navbar />
        </div>

        {/* Right Content */}
        <div style={{ flex: 10, overflowY:'auto', padding: "20px" }}>
          {!onePost ? (
            <>
              {/* Profile Section */}
              <div className="mb-4">
                <Profile />
              </div>

              {/* Posts Grid */}
              <div className="container-fulid "style={{marginBottom:"2rem"}}>
                {posts.length > 0 ? (
                  <div className="row g-3 m-0">
                    {posts.map((post, index) => (
                      <div
                        onClick={() => setOnePost(post)}
                        key={index}
                        className="col-6 col-md-4 col-lg-3"
                      >
                        {post.postImage ? (
                          <div className="position-relative">
                            <img
                              src={post.postImage}
                              alt="user-post"
                              className="img-fluid rounded"
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                
                                height: "278px",
                              }}
                            />
                            {/* Hover effect */}
                            <div
                              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                              style={{
                                background: "rgba(0,0,0,0.4)",
                                opacity: 0,
                                transition: "0.3s",
                              }}
                            >
                              <span className="text-white fw-bold">
                                {post.postDescription || "View Post"}
                              </span>
                            </div>
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
                   <div style={{textAlign:'center', display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',padding:'20px'}}>
                          <img src={postNotFound} style={{width:"100%",maxHeight:'50vh', maxWidth: "400px",}}/>
                          <h4>You haven’t shared anything yet” </h4>
                         
                          </div>
                  
                )}
              </div>
            </>
          ) : (
            <div>
              <FontAwesomeIcon  style={{ cursor: "pointer", fontSize: "2rem", borderRadius:'50%' }}
                type="button" onClick={() => setOnePost(false)} icon={faArrowCircleLeft} />
              <SpacificPost item={onePost} />
            </div>
          )}
        </div>

        {/* Bottom Navbar for mobile */}
        <div className="d-block d-md-none">
          <Navbar />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
