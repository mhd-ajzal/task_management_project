import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Dashboard, Assignment, People, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Tasks', icon: <Assignment />, path: '/tasks' },
        ...(user?.role === 'SUPERADMIN' ? [{ text: 'Users', icon: <People />, path: '/users' }] : []),
        { text: 'Profile', icon: <Person />, path: '/profile' }
    ];

    return (
        <Drawer open={open} onClose={onClose}>
            <List>
                {menuItems.map((item) => (
                    <ListItem button key={item.text} onClick={() => { navigate(item.path); onClose(); }}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default Sidebar;