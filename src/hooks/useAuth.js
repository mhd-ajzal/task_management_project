import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const useAuthRedirect = (redirectPath = '/login') => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate(redirectPath);
        }
    }, [user, navigate, redirectPath]);

    return user;
};

export default useAuthRedirect;