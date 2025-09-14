import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useSelector((state) => state.auth)

    if (loading) {
        return <Loader />
    }

    return (
        !isAuthenticated ? children : <Navigate to='/dashboard' replace={true} />
    )
}

export default PublicRoute;