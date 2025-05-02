import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const TaskReportDialog = ({ open, onClose, onSubmit }) => {
    const [report, setReport] = useState({
        completion_report: '',
        worked_hours: 0
    });

    const handleChange = (e) => {
        setReport({ ...report, [e.target.name]: e.target.value });
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Submit Completion Report</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Worked Hours"
                    type="number"
                    name="worked_hours"
                    value={report.worked_hours}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Completion Report"
                    name="completion_report"
                    multiline
                    rows={4}
                    value={report.completion_report}
                    onChange={handleChange}
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => onSubmit(report)} variant="contained">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskReportDialog;