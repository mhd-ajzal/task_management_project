import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '../services/api';
import { Box, Typography, Paper, Button } from '@mui/material';
import UserForm from '../components/Users/UserForm';

const UserDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${id}/`);
                setUser(response.data);
            } catch (error) {
                navigate('/users');
            }
        };

        if (currentUser?.role === 'SUPERADMIN') {
            fetchUser();
        } else {
            navigate('/');
        }
    }, [id, currentUser, navigate]);

    const handleUpdate = async (formData) => {
        try {
            await api.put(`/users/${id}/`, formData);
            navigate('/users');
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    if (!user) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>User Details</Typography>
            <Paper sx={{ p: 3 }}>
                <UserForm user={user} onSubmit={handleUpdate} />
            </Paper>
        </Box>
    );
};

export default UserDetailPage;