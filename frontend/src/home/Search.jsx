import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import NavLogoBar from "../navbar/NavLogoBar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import maleUser from "../assets/male-user.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { api } from "../protact-route/api";

const Search = () => {
  const [userNameToFind, setUserNameToFind] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiData, setAiData] = useState('');

  const navigate = useNavigate();
  const { id } = useSelector((state) => state.user);

  useEffect(() => {
    if (!userNameToFind.trim()) {
      setData([]);
      setAiData(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await api.post(`/user/username/${userNameToFind}`);
          
          if (response?.status === 200) {
            setData(response.data.users || []);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [userNameToFind]);

  const handleUserClick = (item) => {
    if (id === item._id) {
      navigate("/profile");
    } else {
      navigate(`/users/${item._id}`);
    }
  };
   
  const searchSomthing=async()=>{
  const askingQuestion=  userNameToFind
     try {
      setLoading(true)
      const response = await api.post('user/get-ai-data',{question: askingQuestion})

if(response.status===200){

  setAiData(response.data.ai)    
delayDebounce()  
setLoading(false)

}
     } catch (error) {
      setLoading(false)
     }
  }

  return (
 <div style={{ minHeight: "100vh", backgroundColor: "#121212" }}>
  {/* Top logo bar for mobile */}
  <div className="d-md-none">
    <NavLogoBar />
  </div>

  <div className="d-flex">
    {/* Desktop Sidebar */}
    <div className="d-none d-md-block" style={{ flex: 3 }}>
      <Navbar />
    </div>

    {/* Search Content */}
    <div style={{ flex: 9, padding: "1.5rem" }}>
      {/* Search Bar */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <input
          type="text"
          value={userNameToFind}
          onChange={(e) => setUserNameToFind(e.target.value)}
          placeholder="Search users..."
          className="form-control"
          style={{
            borderRadius: "10px",
            padding: "0.6rem 1rem",
            backgroundColor: "#1f1f1f",
            color: "white",
            border: "1px solid #333",
          }}
        />
        <button
          onClick={searchSomthing}
          className="btn"
          style={{
            backgroundColor: "#ffca2c",
            borderRadius: "10px",
            padding: "0.6rem 1rem",
          }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      {/* AI Data */}
      {aiData?.text && (
        <p style={{ color: "#e0e0e0", fontStyle: "italic" }}>{aiData.text}</p>
      )}

      {/* Loading / Empty state */}
      {loading && (
        <p className="text-center text-muted">Loading...</p>
      )}
      {!loading && userNameToFind && data.length === 0 && (
        <p className="text-center text-muted">No users found</p>
      )}

      {/* Search Results */}
      <div className="d-flex flex-column gap-3">
        {data.map((item, index) => (
          <div
            key={item._id || index}
            className="d-flex align-items-center p-3 shadow-sm"
            onClick={() => handleUserClick(item)}
            style={{
              backgroundColor: "#1c1c1c",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#2c2c2c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#1c1c1c")
            }
          >
            <img
              src={item.profilePic || maleUser}
              alt="profile"
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ffca2c",
              }}
            />
            <div className="ms-3">
              <h6 className="mb-1 text-light fw-semibold">
                @{item.username || "Unknown"}
              </h6>
              <small className="text-muted">
                {item.fullName || "No Name"}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Mobile Bottom Navbar */}
    <div className="d-md-none fixed-bottom">
      <Navbar />
    </div>
  </div>
</div>

  );
};

export default Search;
