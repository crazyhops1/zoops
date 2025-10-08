import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import authlog from '../assets/authlog.jpg'
import maleUser from '../assets/male-user.svg'


const Profile = () => {
  const { fullName, followers, following, post, profilePic, userName ,id,bio} =
    useSelector((state) => state.user || {})
    const navigate=useNavigate()
    

  return (
    <div
      style={{
        backgroundColor: '#282828',
        color: 'white',
        borderRadius: '10px',
        padding: '1rem',
      }}
    >
      {/* Profile row */}
      <div className="d-flex align-items-center mb-3">
        {/* Profile Picture */}
        <img
          src={profilePic || maleUser}
          alt="profile"
          style={{
            width: '6rem',
            height: '6rem',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #fff',
          }}
        />
       

        {/* Stats */}
        <div className="d-flex justify-content-around flex-grow-1 ms-4">
          <div className="text-center">
            <h6 className="mb-0 fw-bold">{post ?? 0}</h6>
            <small>Posts</small>
          </div>
          <div className="text-center" onClick={()=>navigate(`/follower-list/${id}`)}>
            <h6 className="mb-0 fw-bold">{followers ?? 0}</h6>
            <small>Followers</small>
          </div>
          <div className="text-center" onClick={()=>navigate(`/following-list/${id}`)}>
            <h6 className="mb-0 fw-bold">{following ?? 0}</h6>
            <small>Following</small>
          </div>
        </div>
      </div>

      {/* Username & Fullname */}
      <h5 className="mb-1 fw-bold">@{userName || 'username'}</h5>
      <p className="mb-3">{fullName || 'User Name'}</p>
       <p className="mb-3">{bio || ''}</p>


      {/* Action Button */}
       <div className="d-flex gap-2">
             <Link
               className="btn btn-warning w-100 fw-semibold"
              to='/edit-account'
              
             >
              edit profile
             </Link>
             <Link
               className="btn btn-outline-warning w-100 fw-semibold"
             >
               share profile
             </Link>
           </div>
    </div>
  )
}

export default Profile
