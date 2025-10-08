import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../context/UserSlice'
import { api } from '../protact-route/api'

const ProfileLoader = () => {
  const dispatch = useDispatch()
  const { profileUpdate } = useSelector((state) => state.update)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('user/current-user/me')

        if (response?.status === 200 && Array.isArray(response?.data?.users)) {
          const user = response.data.users[0]

          if (user) {
            dispatch(
              setUser({
                id:user._id||'',
                userName: user.username || '',
                fullName: user.fullName || '',
                profilePic: user.profilePic || '', 
                followers: user.followersCount ?? 0,
                following: user.followingCount ?? 0,
                post: user.postCount ?? 0,
                 gender: user.gender || '', 
                bio: user.bio || '', 



              })
            )
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error?.message || error)
      }
    }

    fetchData()
  }, [dispatch, profileUpdate])

  return null
}

export default ProfileLoader
