import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import Login from './auth/Login'
import Signup from './auth/Signup'
import Navbar from './navbar/Navbar'
import Home from './home/Home'
import MessageBox from './messages/MessageBox'
import './App.css'
import{BrowserRouter as Router ,Routes, Route}from 'react-router-dom'
import UserProfile from './profile/UserProfile'
import ProtactRote from './protact-route/ProtactRote'
import store from './context/createStore'
import { Provider } from 'react-redux'
import ProfileLoader from './profile/ProfileLoader'
import Search from './home/Search'
import SeeOtherUserAccount from './profile/SeeOtherUserAccount'
import ChatBox from './messages/ChatBox'
import UploadPost from './feed/UploadPost'
import FollowerOrFollowingList from './home/FollowerOrFollowingList'
import EditProfile from './home/EditProfile'
import ContactBox from './messages/ContactBox'

const App = () => {

  return (

      <Router>

        <Routes>
       <Route element={<Provider store={store}><ProtactRote/>
       <ProfileLoader/>
       </Provider>}>
           <Route path='/'element={<Home/>}/>
          <Route path='/messages' element={<ContactBox/>}/>
          <Route path='/profile' element={<UserProfile/>}/>
           <Route path='/upload-post' element={<UploadPost/>}/>
           <Route path='/follower-list/:id' element={<FollowerOrFollowingList statusPath={'follower'}/>}/>
           <Route path='/following-list/:id' element={<FollowerOrFollowingList statusPath={'following'}/>}/>
           <Route path='/edit-account' element={<EditProfile/>}/>


           <Route path='/search' element={<Search/>}/>
           <Route path='/users/:id' element={<SeeOtherUserAccount/>}/>
          <Route path='/d-message/:id' element={<ChatBox/>}/>

            <Route path='*'element={<Home/>}/>
                </Route>
       

   <Route path='/login' element={<Login/>}/>
          <Route path='/signup'element={<Signup/>}/>

   
        </Routes>
       </Router>

  )
}

export default App