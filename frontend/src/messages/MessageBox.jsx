import React, { useState } from 'react'
import ChatBox from './ChatBox'
import Navbar from '../navbar/Navbar'
import ContactBox from './ContactBox'
import { useParams } from 'react-router-dom'

const MessageBox = () => {
    const [hideComp, setHideComp] = useState()


   const{id}= useParams()

   return (


        <div style={{height:"100vh"}} >
         
            <div className='d-flex '>
                <div className=' d-md-block' style={{ display: "none", flex: '2', }}>
                    <Navbar /> </div>

                <div style={{ justifyContent:'center' ,flex: '4'}}>
                    <ContactBox /> </div>
                <div className=' d-md-block' style={{ display: "none", flex: 6, }}>
                    <ChatBox /> </div>
            </div>
        </div>

    )
}

export default MessageBox