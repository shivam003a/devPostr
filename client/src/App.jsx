import './App.css'
import Landing from './pages/Landing'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard.jsx'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './redux/slices/auth.slice.js'
import VerifyOTP from './pages/VerifyOTP.jsx'
import PublicRoute from './components/common/PublicRoute.jsx'
import PrivateRoute from './components/common/PrivateRoute.jsx'
import OtpRoute from './components/common/OtpRoute.jsx'
import GeneratePost from './components/dashboard/GeneratePost.jsx'
import PostsInterface from './components/dashboard/PostsInterface.jsx'
import LostPage from './components/common/LostPage.jsx'
import Setting from './components/dashboard/Setting.jsx'

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
          <Route path='settings' element={<Setting />} />
          <Route path=':batchId' element={<PostsInterface />} />
        </Route>
        <Route path='*' element={<LostPage />} />
      </Routes>
    </>
  )
}

export default App
