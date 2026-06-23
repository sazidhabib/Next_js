import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth"; // Adjust the path if necessary

const ProtectedAdminRoute = ({ children }) => {
    const { isLoggedIn, isAdmin } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedAdminRoute;
