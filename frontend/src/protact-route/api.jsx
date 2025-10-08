import axios from "axios"


export const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKENDURL}/zoops`,
    withCredentials: true
})

api.interceptors.response.use(
    (response) => {
        return response
    },
    async (err) => {
        if (err.response?.status === 401) {
            try {
                const token = await api.get('/auth/refrash')

                localStorage.setItem('token', token.data.token)
                
                return api(err.config)
            } catch (error) {
                dispatch(disconnectSocket())
                localStorage.removeItem('token')

                window.location.href = '/login'
                return
            }
        }

        if (err.response?.status === 419) {
            window.location.href = '/login'
            return
        }
    }
)