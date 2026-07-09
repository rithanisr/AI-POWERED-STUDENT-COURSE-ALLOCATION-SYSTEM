import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 0.5,
          }}
          onClick={() => navigate('/')}
        >
          AI Allocation
        </Typography>
       
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;