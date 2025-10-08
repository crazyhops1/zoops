import React from 'react'
import Navbar from '../navbar/Navbar'
import OtherUser from '../profile/OtherUser'
import NavLogoBar from '../navbar/NavLogoBar'
import AllPost from '../feed/AllPost'

const Home = () => {
  return (
<div>
  <div className=' d-md-none ' style={{ display: "block", }}>
    <NavLogoBar/>
        </div>
      <div style={{ display: 'flex' }}>
      
      <div className=' d-md-block ' style={{ flex: 2, display: "none", }}>
        
        <Navbar />
      </div>
      <div className=' ' style={{ flex:6 }} >
        
        <AllPost/>
        <div className=' d-md-none ' style={{ display: "block", }}>
          <Navbar />
        </div>

      </div>
      <div className=' d-md-block ' style={{ flex: 4, display: "none", }}>

        <OtherUser />
      </div>
    </div>
</div>
  )
}

export default Home