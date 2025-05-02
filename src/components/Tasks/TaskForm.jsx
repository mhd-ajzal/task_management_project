import { TextField, Button, Box } from '@mui/material';

const TaskForm = ({ task, onSubmit }) => {
    const [formData, setFormData] = useState(task || {
        title: '',
        description: '',
        due_date: format(new Date(), 'yyyy-MM-dd')
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Box component="form" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
            <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                margin="normal"
                required
            />
            <TextField
                fullWidth
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                margin="normal"
            />
            <TextField
                fullWidth
                label="Due Date"
                type="date"
                name="due_date"
                InputLabelProps={{ shrink: true }}
                value={formData.due_date}
                onChange={handleChange}
                margin="normal"
                required
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                {task ? 'Update' : 'Create'} Task
            </Button>
        </Box>
    );
};

export default TaskForm;