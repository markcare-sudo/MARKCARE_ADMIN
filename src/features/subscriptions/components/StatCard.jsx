import { Card, Box, Typography } from '@mui/material';

const StatCard = ({ icon, label, value, color }) => (
    <Card sx={{ flex: 1, margin: '0 10px', padding: 2, display: 'flex', alignItems: 'center', borderRadius: 2 }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: `${color}15`,
            color: color,
            marginRight: 2
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                {label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {value}
            </Typography>
        </Box>
    </Card>
);

export default StatCard