import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

const RestrictedRoute = ({ children }) => {
    const { user, isLoading } = useAuthStore();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (user) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default RestrictedRoute;