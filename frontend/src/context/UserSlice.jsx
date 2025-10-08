import { createSlice } from '@reduxjs/toolkit'







const initialState = {
    id: null,
    uesrName: null,
    fullName: null,
    followers: null,
    following: null,
    profilePic: null,
    post: null,
    bio: null,
    gender: null


}


const userUpadateInitialState = {
    profileUpdate: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.id = action.payload.id
            state.userName = action.payload.userName
            state.fullName = action.payload.fullName
            state.profilePic = action.payload.profilePic
            state.followers = action.payload.followers
            state.following = action.payload.following
            state.post = action.payload.post
            state.bio = action.payload.bio
            state.gender = action.payload.gender




        },
        clearUser: (state, action) => {

            action.payload
            state.uesrName = '';
            state.profilePic = '';
            state.following = '';
            state.followers = '';
            state.fullName = '';
            state.post = '';
            state.id = ''
            state.bio = '',
                state.gender = ''







        }


    }
})

const userProfileUpdateSlice = createSlice({
    name: 'update',
    initialState: userUpadateInitialState,
    reducers: {
        setUserProfileUpdate: (state, action) => {
            state.profileUpdate = action.payload.profileUpdate
        }
    }


})
export const { setUserProfileUpdate } = userProfileUpdateSlice.actions
export const profileUpdateSlice = userProfileUpdateSlice.reducer

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer