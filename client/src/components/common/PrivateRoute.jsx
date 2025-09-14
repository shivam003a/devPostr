import { useSelector } from "react-redux";
import Loader from "./Loader";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useSelector(state => state.auth)

    if (loading) {
        return <Loader />
    }

    return (
        isAuthenticated ? children : <Navigate to='/login' replace={true} />
    )
}

export default PrivateRoute;