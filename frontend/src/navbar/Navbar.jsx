import React, { useEffect, useState } from "react";
import hopslogomob from "../assets/hopslogomob.PNG";
import hopslogo from "../assets/hopslogo.png";

import {
  faHome,
  faMessage,
  faCompass,
  faPaperPlane,
  faSquarePlus,
  faHeart,
  faUser,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useMessageCount } from "../customHooks/customHooks";
import { useSelector } from "react-redux";

const Navbar = () => {
 const navigate = useNavigate();
  let  count=useMessageCount()
 const [totalUnread,setTotalUnread]=useState('')

useEffect(()=>{
  console.log(count)
let kk=  count.filter(item => item.unreadCount>0).length;
console.log(kk)
setTotalUnread(kk)
},[count])

 
  return (
    <>
      {/* Sidebar (Desktop / Tablet) */}
      <nav
        className="d-none d-md-flex flex-column justify-content-between  "

        style={{
          height: "100vh",
          backgroundColor: "black",
          color: 'white',
          position: "fixed",
          top: 0,
          left: 0,
          paddingRight: "3rem",
          padding: '1rem',
          transition: "all 0.3s ease",
        }}
      >
        {/* Top: Logo */}
        {/* Top: Logo */}
<div className="mb-4">
  {/* Mobile logo */}
  <img
    src={hopslogomob}
    alt="Logo"
    className="d-inline d-lg-none"
    style={{
      width: "40px",          // smaller on mobile
      height: "auto",
      cursor: "pointer",
      objectFit: "cover",
      objectPosition: "top left",
    }}
    onClick={() => navigate("/")}
  />

  {/* Desktop logo */}
  <img
    src={hopslogo}
    alt="Logo"
    className="d-none d-lg-inline"
    style={{
      width: "120px",         // full size on desktop
      height: "auto",
      cursor: "pointer",
      objectFit: "cover",
      objectPosition: "top left",
    }}
    onClick={() => navigate("/")}
  />
</div>


        {/* Middle: Nav Items */}
        <ul
          className="d-flex flex-column gap-4 mt-4"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          <li>
            <Link
              to="/"
              className="d-flex align-items-center gap-3"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              <FontAwesomeIcon icon={faHome} size="lg" />
              <span className="d-none d-lg-inline">Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/search"
              className="d-flex align-items-center gap-3"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              <FontAwesomeIcon icon={faSearch} size="lg" />
              <span className="d-none d-lg-inline">Search</span>
            </Link>
          </li>

          <li>
            <Link
              to="/messages"
              className="d-flex align-items-center gap-3  position-relative"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "16px",
              }}

            >
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {totalUnread||''}

              </span>
              <FontAwesomeIcon icon={faMessage} size="lg" />
            
              <span className="d-none d-lg-inline">messages</span>

            </Link>

          </li>
          <li>
            <Link
              to="/upload-post"
              className="d-flex align-items-center gap-3"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              <FontAwesomeIcon icon={faSquarePlus} size="lg" />
              <span className="d-none d-lg-inline">Create</span>
            </Link>
          </li>
          <li>
            <Link
              to="/notifications"
              className="d-flex align-items-center gap-3"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              <FontAwesomeIcon icon={faHeart} size="lg" />
              <span className="d-none d-lg-inline">Notifications</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile"
              className="d-flex align-items-center gap-3"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              <FontAwesomeIcon icon={faUser} size="lg" />
              <span className="d-none d-lg-inline">Profile</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Bottom Navbar (Mobile) */}
      <nav
        className="d-md-none d-flex justify-content-around align-items-center"
        style={{
          backgroundColor: "black",
          height: "60px",
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
        }}
      >
        <Link to="/" style={{ color: "white" }}>
          <FontAwesomeIcon icon={faHome} size="lg" />
        </Link>
        <Link to="/search" style={{ color: "white" }}>
          <FontAwesomeIcon icon={faSearch} size="lg" />
        </Link>

        <Link to="/upload-post" style={{ color: "white" }}>
          <FontAwesomeIcon icon={faSquarePlus} size="lg" />
        </Link>
        <Link to="/profile" style={{ color: "white" }}>
          <FontAwesomeIcon icon={faUser} size="lg" />
        </Link>
      </nav>
    </>
  );
};

export default Navbar;

