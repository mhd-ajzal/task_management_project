import { Card, CardContent, Typography, Box } from '@mui/material';

const StatsCard = ({ icon, title, value, color = 'primary' }) => {
    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ color, mr: 2 }}>{icon}</Box>
                    <Box>
                        <Typography variant="h6">{title}</Typography>
                        <Typography variant="h4">{value}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatsCard;