import api from './api';

export const fetchTasks = async () => {
    const response = await api.get('/tasks/');
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await api.post('/tasks/', taskData);
    return response.data;
};

export const updateTaskStatus = async (taskId, status, reportData = null) => {
    const data = { status, ...reportData };
    const response = await api.patch(`/tasks/${taskId}/update_status/`, data);
    return response.data;
};

export const fetchTaskReport = async (taskId) => {
    const response = await api.get(`/tasks/${taskId}/report/`);
    return response.data;
};