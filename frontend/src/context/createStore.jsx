import {configureStore} from'@reduxjs/toolkit'
import reducer, { profileUpdateSlice } from './UserSlice'
import realtimesocket  from './Socket.io'
const store = configureStore({
    reducer:{
        user:reducer ,
        update:profileUpdateSlice,
        socket:realtimesocket
    }
})
export default store