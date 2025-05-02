import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Task Manager
                </Typography>
                {user && (
                    <>
                        <Button color="inherit" onClick={() => navigate('/dashboard')}>
                            Dashboard
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/tasks')}>
                            Tasks
                        </Button>
                        {user.role === 'SUPERADMIN' && (
                            <Button color="inherit" onClick={() => navigate('/users')}>
                                Users
                            </Button>
                        )}
                        <Button color="inherit" onClick={() => navigate('/profile')}>
                            Profile
                        </Button>
                        <Button color="inherit" onClick={logout}>
                            Logout
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;