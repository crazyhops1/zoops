import React, { useEffect, useState } from 'react'
import authlog from '../assets/authlog.jpg'
import hopslogo from '../assets/hopslogo.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { api } from '../protact-route/api'

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '', otp: '' })
  const [error, setError] = useState('')
  const [useVerifyStatus, setUseVerifyStatus] = useState(false)
  const [data, setData]=useState('')
  const navigate = useNavigate()

  const loginForm = async (e) => {
    e.preventDefault()
    setError('')

    if (!useVerifyStatus && formData.password.length < 8) {
      return setError('Password should be greater than 8 characters')
    }

    try {
      if (!useVerifyStatus) {
        // Login attempt
        const response = await axios.post(`${import.meta.env.VITE_BACKENDURL}/zoops/auth/login`, {
          username: formData.username,
          password: formData.password,
        },{withCredentials:true})

        if (response.status === 200) {
          console.log(response.data)
          localStorage.setItem('token', response.data.token)
          localStorage.setItem('id', response.data.id)
          return navigate('/')
        }
      } else {
        // OTP verification
        const response = await axios.post(`${import.meta.env.VITE_BACKENDURL}/zoops/auth/otpverify`, {
          otp: formData.otp,
          email: data,
        },{withCredentials:true})

        if (response.status === 200) {
          setUseVerifyStatus(false)
          return 
        }
      }
    } catch (err) {
      
     if(err){
      if (err.response?.status === 403) {
    setUseVerifyStatus(true) // show OTP form
    setError('OTP not verified. Please enter OTP.')
    setData(err.response.data.email)
}
 else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid OTP')
      } else {
        setError('Something went wrong')
      }
     }
    }
  }
useEffect(()=>{
  
    console.log(useVerifyStatus)


},[useVerifyStatus])
  return (
    <div className="container-fluid" style={{ backgroundColor: '#121212' }}>
      <div className="row rounded" style={{ backgroundColor: '#282828', color: 'white', minHeight: '100vh' }}>
        {/* LEFT FORM */}
        <div className="col-md-6 p-0 d-flex flex-column justify-content-center">
          <nav style={{ width: '120px', margin: '12px auto' }}>
            <img src={hopslogo} className="img-fluid" alt="Logo" />
          </nav>

          <form
            onSubmit={loginForm}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '350px',
              margin: '0 auto',
            }}
          >
            <h3 className="mb-4 text-center">{useVerifyStatus ? 'Enter OTP' : 'Welcome Back'}</h3>

            {error && <div className="alert alert-danger w-100 text-center">{error}</div>}

            {!useVerifyStatus && (
              <>
                <div className="w-100 mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="form-control"
                    style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid #555' }}
                    required
                  />
                </div>

                <div className="w-100 mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="form-control"
                    style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid #555' }}
                    required
                  />
                </div>
              </>
            )}

            {useVerifyStatus && (
              <div className="w-100 mb-3">
                <label htmlFor="otp" className="form-label">OTP</label>
                <input
                  type="text"
                  id="otp"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  className="form-control"
                  style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid #555' }}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-light mt-2 w-100"
              style={{ borderRadius: '8px', fontWeight: 'bold' }}
            >
              {useVerifyStatus ? 'Verify OTP' : 'Login'}
            </button>
          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="col-md-6 p-0 d-none d-md-flex align-items-center">
          <img
            src={authlog}
            alt="Auth Illustration"
            className="img-fluid rounded"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  )
}

export default Login
