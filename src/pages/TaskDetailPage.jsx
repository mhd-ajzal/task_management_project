import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    Chip,
    Divider,
    TextareaAutosize,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { Edit, CheckCircle, ArrowBack } from '@mui/icons-material';

const TaskDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openReportDialog, setOpenReportDialog] = useState(false);
    const [reportData, setReportData] = useState({
        completion_report: '',
        worked_hours: 0
    });

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            const response = await api.get(`/tasks/${id}/`);
            setTask(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch task details');
            navigate('/tasks');
        }
    };

    const handleStatusUpdate = async (status) => {
        try {
            if (status === 'COMPLETED') {
                setOpenReportDialog(true);
                return;
            }

            await api.patch(`/tasks/${id}/update_status/`, { status });
            toast.success('Task status updated');
            fetchTask();
        } catch (error) {
            toast.error('Failed to update task status');
        }
    };

    const submitCompletionReport = async () => {
        try {
            await api.patch(`/tasks/${id}/update_status/`, {
                status: 'COMPLETED',
                ...reportData
            });
            toast.success('Task marked as completed with report');
            setOpenReportDialog(false);
            fetchTask();
        } catch (error) {
            toast.error('Failed to submit completion report');
        }
    };

    if (loading) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/tasks')}
                sx={{ mb: 2 }}
            >
                Back to Tasks
            </Button>

            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h4">{task.title}</Typography>
                    <Chip
                        label={task.status.replace('_', ' ')}
                        color={
                            task.status === 'COMPLETED' ? 'success' :
                                task.status === 'IN_PROGRESS' ? 'warning' : 'default'
                        }
                    />
                </Box>

                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Assigned to: {task.assigned_to.username}
                </Typography>

                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    Due Date: {format(new Date(task.due_date), 'MMM dd, yyyy')}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
                <Typography sx={{ mb: 3 }}>{task.description}</Typography>

                {task.status === 'COMPLETED' && (
                    <>
                        <Typography variant="h6" sx={{ mb: 1 }}>Completion Report</Typography>
                        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                            <Typography sx={{ mb: 1 }}>
                                <strong>Worked Hours:</strong> {task.worked_hours}
                            </Typography>
                            <Typography>{task.completion_report}</Typography>
                        </Paper>
                    </>
                )}

                {user.role === 'USER' && task.assigned_to.id === user.user_id && (
                    <Box sx={{ mt: 3 }}>
                        {task.status !== 'COMPLETED' && (
                            <Button
                                variant="contained"
                                startIcon={<CheckCircle />}
                                onClick={() => handleStatusUpdate('COMPLETED')}
                                sx={{ mr: 2 }}
                            >
                                Mark as Completed
                            </Button>
                        )}
                        {task.status !== 'IN_PROGRESS' && task.status !== 'COMPLETED' && (
                            <Button
                                variant="outlined"
                                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                            >
                                Start Progress
                            </Button>
                        )}
                    </Box>
                )}
            </Paper>

            <Dialog open={openReportDialog} onClose={() => setOpenReportDialog(false)}>
                <DialogTitle>Submit Completion Report</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Worked Hours"
                        type="number"
                        margin="normal"
                        value={reportData.worked_hours}
                        onChange={(e) => setReportData({ ...reportData, worked_hours: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Completion Report"
                        margin="normal"
                        multiline
                        rows={4}
                        value={reportData.completion_report}
                        onChange={(e) => setReportData({ ...reportData, completion_report: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReportDialog(false)}>Cancel</Button>
                    <Button onClick={submitCompletionReport} variant="contained">Submit</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TaskDetailPage;