import './App.css'
import Landing from './pages/Landing'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/dashboard.jsx'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './redux/slices/auth.slice.js'
import VerifyOTP from './pages/VerifyOTP.jsx'
import PublicRoute from './components/common/PublicRoute.jsx'
import PrivateRoute from './components/common/PrivateRoute.jsx'
import OtpRoute from './components/common/OtpRoute.jsx'
import GeneratePost from './components/dashboard/GeneratePost.jsx'
import PostsInterface from './components/dashboard/PostsInterface.jsx'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [])

  return (
    <>
      <Routes>
        <Route index element={<Landing />} />
        <Route path={'/login'} element={<PublicRoute><Login /></PublicRoute>} />
        <Route path={'/register'} element={<PublicRoute><Register /></PublicRoute>} />
        <Route path={'/verify-otp'} element={<OtpRoute><VerifyOTP /></OtpRoute>} />
        <Route path={'/dashboard'} element={<PrivateRoute><Dashboard /></PrivateRoute>} >
          <Route index element={<GeneratePost />} />
          <Route path=':batchId' element={<PostsInterface />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
