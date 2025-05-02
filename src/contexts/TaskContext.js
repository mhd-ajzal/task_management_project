import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.warn('No access token found. Skipping task fetch.');
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/tasks/');
            setTasks(response.data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            if (error.response && error.response.status === 401) {
                // Handle unauthorized error
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login'; // Redirect to login page
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <TaskContext.Provider value={{ tasks, loading, refreshTasks: fetchTasks }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => useContext(TaskContext);