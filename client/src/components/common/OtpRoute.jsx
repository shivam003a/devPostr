import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from './Loader'

function OtpRoute({ children }) {
    const { isAuthenticated, loading, otpInfo, otpRequired } = useSelector(state => state.auth)

    if (loading) return <Loader />

    return otpRequired && Object.keys(otpInfo)?.length > 0 ? children : (isAuthenticated ? <Navigate to="/dashboard" replace={true} /> : <Navigate to="/login" replace={true} />)
}

export default OtpRoute;