import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Paper, Button } from '@mui/material';

const ProfilePage = () => {
    const { user, logout } = useAuth();

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>My Profile</Typography>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6">Username: {user?.username}</Typography>
                <Typography variant="h6">Role: {user?.role}</Typography>
                <Button
                    variant="contained"
                    color="error"
                    onClick={logout}
                    sx={{ mt: 3 }}
                >
                    Logout
                </Button>
            </Paper>
        </Box>
    );
};

export default ProfilePage;