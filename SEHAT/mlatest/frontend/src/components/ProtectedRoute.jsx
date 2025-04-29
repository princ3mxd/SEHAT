import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';

const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuthStore();
    const location = useLocation();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

export default ProtectedRoute;