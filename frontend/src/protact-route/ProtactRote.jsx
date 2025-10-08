import { useDispatch } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
import { connectSocket } from "../context/Socket.io"
const dispatch=useDispatch

const ProtactRote = () => {
    const user = localStorage.getItem('token')
    if (!user) {
       
        return <Navigate to='/login' />
    } else {
        dispatch(connectSocket())
        return <Outlet />
    }
}

export default ProtactRote
