import React, { useEffect, useState } from "react";
import authlog from "../assets/authlog.jpg";
import { useNavigate, useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "../protact-route/api";
import NavLogoBar from "../navbar/NavLogoBar";
import Navbar from "../navbar/Navbar";

const FollowerOrFollowingList = ({ statusPath }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  const fetchData = async (pageNumber = 1) => {
    try {
      setLoading(true);
      let response;

      if (statusPath === "follower") {
        response = await api.get(
          `follow/followersList/${id}?page=${pageNumber}&limit=${limit}`
        );
      } else if (statusPath === "following") {
        response = await api.get(
          `follow/followingList/${id}?page=${pageNumber}&limit=${limit}`
        );
      }

      if (response?.status === 200) {
        const data = response.data.followers || response.data.following || [];

        if (pageNumber === 1) {
          setList(data);
        } else {
          setList((prev) => [...prev, ...data]);
        }

        setHasMore(data.length === limit);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, [id, statusPath]);

  const fetchNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  };

  if (loading && page === 1)
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-warning" role="status"></div>
        <p className="text-light mt-2">Loading...</p>
      </div>
    );

  if (error)
    return (
      <p className="text-danger text-center my-4">Something went wrong!</p>
    );

  return (
    <div>
      <NavLogoBar />
      <div style={{ display: 'flex' }}>

        <div className='d-md-block' style={{ display: "none", flex: 2 }}>
          <Navbar />
        </div>
        <div style={{flex:10,height:"100vh",overflow:"scroll"}}>
          <div>
          <div className="container">
            <h2 className="text-light text-center my-4 fw-bold">
              {statusPath === "follower" ? "Followers" : "Following"}
            </h2>

            {list.length === 0 ? (
              <p className="text-muted text-center">
                No {statusPath === "follower" ? "followers" : "following"} found
              </p>
            ) : (
              <InfiniteScroll
                dataLength={list.length}
                next={fetchNext}
                hasMore={hasMore}
                loader={
                  <div className="text-center my-3">
                    <div className="spinner-border text-warning" role="status"></div>
                  </div>
                }
                scrollableTarget="scrollableDiv"
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                {list.map((user, index) => (
                  <div
                    key={user._id || index}
                    className="d-flex align-items-center p-3 shadow-sm"
                    onClick={() => navigate(`/users/${user._id}`)}
                    style={{
                      backgroundColor: "#1f1f1f",
                      borderRadius: "12px",
                      transition: "0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#2c2c2c")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1f1f1f")
                    }
                  >
                    <img
                      src={user.profilePic || authlog}
                      style={{
                        width: "3.2rem",
                        height: "3.2rem",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "2px solid #ffca2c",
                      }}
                      alt="profile"
                    />
                    <div className="ms-3">
                      <h6 className="m-0 text-light fw-semibold">
                        {user.username || "Unknown"}
                      </h6>
                      <small className="text-muted">{user.fullName || "No Name"}</small>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            )}
          </div>
          <div className='d-md-none' style={{ display: "block" }}>
            <Navbar />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default FollowerOrFollowingList;
