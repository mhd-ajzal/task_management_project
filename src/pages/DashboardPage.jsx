import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import {
    Assignment as TaskIcon,
    People as UserIcon,
    CheckCircle as CompletedIcon,
    HourglassEmpty as PendingIcon
} from '@mui/icons-material';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        totalUsers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const tasksResponse = await api.get('/tasks/');
            const tasks = tasksResponse.data;

            let totalTasks = tasks.length;
            let completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
            let pendingTasks = tasks.filter(t => t.status !== 'COMPLETED').length;

            let totalUsers = 0;
            if (user.role === 'SUPERADMIN') {
                const usersResponse = await api.get('/users/');
                totalUsers = usersResponse.data.length;
            }

            setStats({
                totalTasks,
                completedTasks,
                pendingTasks,
                totalUsers
            });
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch dashboard data');
            setLoading(false);
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <TaskIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">Total Tasks</Typography>
                                    <Typography variant="h4">{stats.totalTasks}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CompletedIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">Completed</Typography>
                                    <Typography variant="h4">{stats.completedTasks}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <PendingIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                                <Box>
                                    <Typography variant="h6">Pending</Typography>
                                    <Typography variant="h4">{stats.pendingTasks}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {user.role === 'SUPERADMIN' && (
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <UserIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h6">Total Users</Typography>
                                        <Typography variant="h4">{stats.totalUsers}</Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default DashboardPage;