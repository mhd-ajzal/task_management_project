import { TextField, Select, MenuItem, Button, Box } from '@mui/material';
import React, { useState } from 'react';

const UserForm = ({ user, onSubmit }) => {
    const [formData, setFormData] = useState(user || {
        username: '',
        password: '',
        role: 'USER'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
            <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required={!user}
            />
            <Select
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                margin="dense"
                sx={{ mt: 2, mb: 2 }}
            >
                <MenuItem value="USER">User</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
                <MenuItem value="SUPERADMIN">SuperAdmin</MenuItem>
            </Select>
            <Button type="submit" variant="contained">
                {user ? 'Update' : 'Create'} User
            </Button>
        </Box>
    );
};

export default UserForm;