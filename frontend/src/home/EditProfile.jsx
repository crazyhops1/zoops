import React, { useState } from 'react'
import maleUser from '../assets/male-user.svg'
import { useSelector } from 'react-redux'
import { api } from '../protact-route/api'
import NavLogoBar from '../navbar/NavLogoBar'
import Navbar from '../navbar/Navbar'

const EditProfile = () => {
  const { fullName, profilePic, userName, id, bio, gender } =
    useSelector((state) => state.user || {})

  const [pic, setPic] = useState(null)
  const [newBio, setNewBio] = useState(bio || '')
  const [newGender, setNewGender] = useState(gender || '')
  const [newFullName, setNewFullName] = useState(fullName || '')

  // update profile
  const updateProfile = async () => {
    try {
      if (pic) {
        

        await api.patch('/user/profile-pic-update', {profilePic:pic}, {
          headers: { "Content-Type": "multipart/form-data" }
        })
      }

      // update bio / gender / fullName
      await api.patch('/user/update-profile-data-update', {
        bio: newBio.trim(),
        gender: newGender,
        fullName: newFullName.trim()
      })

      alert("Profile updated successfully ✅")
    } catch (error) {
      console.error(error)
      alert("Failed to update profile ❌")
    }
  }

  return (
 <div>
  <NavLogoBar/>
  <div style={{display:'flex'}}>
      <div className='d-md-block'style={{ display:"none", flex: 2 ,}}>
          <Navbar/>
        </div>
    <div style={{flex:10,height: "100vh",marginBottom:"3rem"}}>
         <div className="  " style={{ }}>
      <div>
        <h3 className="text-light mb-4">Edit Profile</h3>

        {/* Profile Card */}
        <div className="d-flex flex-wrap align-items-center justify-content-between p-4 shadow mb-4"
          style={{
            backgroundColor: "#1c1c1c",
            borderRadius: "16px",
            gap: "1.5rem",
          }}
        >
          {/* Profile Picture */}
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={
                pic
                  ? URL.createObjectURL(pic)
                  : profilePic || maleUser
              }
              alt="profile"
              style={{
                height: "5rem",
                width: "5rem",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ffca2c",
              }}
            />
          </div>

          {/* Profile Info */}
          <div
            className="profil-body text-center"
            style={{ flex: 1, minWidth: "150px" }}
          >
            <h5 className="text-light mb-1">@{userName}</h5>
            <span className="text-muted">{newFullName}</span>
          </div>

          {/* Change Photo Button */}
          <div className="d-flex align-items-center justify-content-center">
            <label htmlFor='photochange'
              className="btn fw-semibold"
              style={{
                backgroundColor: "#ffca2c",
                borderRadius: "10px",
                padding: "0.6rem 1.2rem",
              }}
            >
              Change Photo
            </label>
            <input
              onChange={(e) => setPic(e.target.files[0])}
              type='file'
              name="profilePic"
              id="photochange"
              
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* Full Name Input */}
        <div className="mb-3">
          <label
            htmlFor="fullname"
            className="form-label fw-semibold"
            style={{ color: "#e0e0e0" }}
          >
            Full Name
          </label>
          <input
            id="fullname"
            type="text"
            className="form-control fw-semibold"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            placeholder="Enter your full name"
            style={{
              width: "100%",
              backgroundColor: "#1c1c1c",
              borderRadius: "10px",
              padding: "0.6rem 1rem",
              border: "1px solid #333",
              color: "white",
            }}
          />
        </div>

        {/* Bio Input */}
        <div className="mb-3">
          <label
            htmlFor="bio"
            className="form-label fw-semibold"
            style={{ color: "#e0e0e0" }}
          >
            Bio
          </label>
          <textarea
            id="bio"
            className="form-control fw-semibold"
            rows="2"
            value={newBio}
            onChange={(e) => setNewBio(e.target.value)}
            placeholder="Tell something about yourself..."
            style={{
              width: "100%",
              backgroundColor: "#1c1c1c",
              borderRadius: "10px",
              padding: "0.8rem 1rem",
              border: "1px solid #333",
              color: "white",
              resize: "none",
            }}
          />
        </div>

        {/* Gender Select */}
        <div className="mb-4">
          <label
            htmlFor="gender"
            className="form-label fw-semibold"
            style={{ color: "#e0e0e0" }}
          >
            Gender
          </label>
          <select
            id="gender"
            className="form-select fw-semibold"
            value={newGender}
            onChange={(e) => setNewGender(e.target.value)}
            style={{
              backgroundColor: "#1c1c1c",
              borderRadius: "10px",
              padding: "0.6rem 1rem",
              border: "1px solid #333",
              color: "white",
            }}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="d-flex justify-content-end">
          <button onClick={updateProfile} className="btn fw-semibold"
            style={{
              backgroundColor: "#ffca2c",
              borderRadius: "10px",
              padding: "0.6rem 1.5rem",
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
      <div className='d-md-none'style={{ display:"block" }}>
          <Navbar/>
      
        </div>
    </div>
  </div>
 </div>
  )
}

export default EditProfile
