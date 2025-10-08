import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import maleUser from '../assets/male-user.svg'
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { clearUser } from "../context/UserSlice";
import { api } from "../protact-route/api";

const OtherUser = () => {
      const { fullName,  profilePic, userName } =
    useSelector((state) => state.user || {})

const dispatch=useDispatch()
const navigate =useNavigate()
    const logOut=async()=>{
        try {
            const response=await api.post('/auth/logOut')
            if(response.status===200){
                
                localStorage.removeItem("token")

                dispatch(clearUser())
                return  navigate('/login')
            
            }
        } catch (error) {
            
        }
    }
    
 
  return (
    <div className="d-flex my-2">
                   
                            <div
                               
                                className="d-flex gap-2 col-md-3 col-sm-12"
                                style={{ color: "white" }}
                            >
                                {/* Profile pic */}
                                <div className="text-center">
                                    <img
                                        src={profilePic||maleUser} // fallback to default
                                        style={{
                                            width: "4rem",
                                            height: "4rem",
                                            borderRadius: "50%",
                                            border: "3px solid white",
                                            backgroundColor: "#fff",
                                            objectFit: "cover",
                                        }}
                                        alt="profile"
                                    />
                                </div>
    
                                <div className="align-items-center">
                                    <h4 className="text-center">@{userName}</h4>
                                    <p className="text-center">{fullName}</p>
                                    
                                </div>
                                <FontAwesomeIcon onClick={logOut} icon={faRightFromBracket} style={{fontSize:"1.6rem"}} className="" />
                            </div>
                      
                </div>
  );
};

export default OtherUser;
