import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import hopslogo from '../assets/hopslogo.png';
import { useMessageCount } from '../customHooks/customHooks';

const NavLogoBar = () => {
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
    <nav
      className="d-md-none d-flex justify-content-around align-items-center"
      style={{
        backgroundColor: "black",
        height: "60px",

        width: "100%",
      }}
    >
      {/* Left: Logo */}
      <div>
        <img
          src={hopslogo}
          alt="Logo"
          style={{ width: '120px', cursor: 'pointer' }}
          className="" // show full logo on large screens
          onClick={() => navigate('/')}
        />

      </div>

      {/* Right: Icons */}
      <div className="d-flex align-items-center gap-3">
        <Link to="/messages" style={{ color: 'white' }} className="d-flex align-items-center gap-3  position-relative"
        >
          <FontAwesomeIcon icon={faMessage} size="lg" />
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            
{totalUnread||''}
          </span>
        </Link>
       
      </div>
    </nav>
  );
};

export default NavLogoBar;
