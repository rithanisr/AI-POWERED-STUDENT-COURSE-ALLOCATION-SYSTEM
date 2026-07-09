import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SchoolIcon from '@mui/icons-material/School';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TimelineIcon from '@mui/icons-material/Timeline';
import Navbar from '../components/Navbar';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SmartToyIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'AI-Powered Allocation',
      description: 'Intelligent algorithm intelligently allocates courses to students based on their preferences and academic performance.',
    },
    {
      icon: <SchoolIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Student Friendly',
      description: 'Simple and intuitive interface for students to apply for courses with their preferences.',
    },
    {
      icon: <AssignmentIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Easy Management',
      description: 'Admin dashboard to manage courses, students, and view allocation results.',
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: 'Real-time Updates',
      description: 'Get instant notifications about allocation status and course updates.',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2,
            }}
          >
            AI-Powered Student Course Allocation System
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              fontSize: { xs: '0.95rem', md: '1.2rem' },
              fontWeight: 300,
              opacity: 0.95,
            }}
          >
            Streamline course allocation with artificial intelligence. Match students to courses intelligently and efficiently.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/student-application')}
              sx={{
                backgroundColor: 'white',
                color: '#1976d2',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Admission Open
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/admin-login')}
              sx={{
                borderColor: 'white',
                color: 'white',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Admin Login
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: '#1565c0',
            }}
          >
            Why Choose Our System?
          </Typography>
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    p: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <CardContent sx={{ p: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#666', lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          backgroundColor: '#1a1a1a',
          color: 'white',
          py: 4,
          mt: 'auto',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                AI Allocation
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Intelligent course allocation system powered by AI.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: 'white' } }}
                  onClick={() => navigate('/student-application')}
                >
                  Student Portal
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: '#999', cursor: 'pointer', '&:hover': { color: 'white' } }}
                  onClick={() => navigate('/admin-login')}
                >
                  Admin Panel
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Support
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                Email: support@aiallocation.com
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Information
              </Typography>
              <Typography variant="body2" sx={{ color: '#999' }}>
                © 2026 AI Allocation System. All rights reserved.
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid #333', pt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#999' }}>
              Built with React 19 & Material UI
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;