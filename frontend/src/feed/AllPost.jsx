import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SpacificPost from "../profile/SpacificPost";
import timelineSvg from "../assets/timeline.svg";
import { api } from "../protact-route/api";

const AllPost = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 4; // posts per page

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/post/timeline?page=${page}&limit=${limit}`);
      if (res.status === 200) {
        
        const newPosts = res.data.timeLine||[];

      
            setData((prev) => {
        const merged = [...prev, ...newPosts];

        const unique = Array.from(new Map(merged.map(post => [post._id, post])).values());
        return unique;
      });

        // check if more posts are available
        if (newPosts.length < limit) {
          setHasMore(false); // no more posts
        } else {
          
          setPage((prev) => prev + 1); // move to next page
        }

    

      }
    } catch (error) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(); // load first page
  }, []);

  return (
    <div
      className="d-flex flex-column  "
      style={{
        
        backgroundColor: "#121212",
        minHeight: "100vh",
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<div className="text-warning mt-3"><div className="spinner-border" role="status"></div></div>}
        endMessage={
          <p style={{ textAlign: "center", color: "gray" }}>
            <b>No more posts</b>
          </p>
        }
      >
        {data.length > 0 ? (
          data.map((item) => <SpacificPost item={item} key={item._id} />)
        ) : (
          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <img
              src={timelineSvg}
              style={{ width: "100%", maxHeight: "50vh", maxWidth: "400px" }}
              alt="timeline empty"
            />
            <h4>No posts here yet</h4>
            <p>Start following people to see updates</p>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default AllPost;
