import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <footer>
      <Box sx={{ mt:5, display: 'block', textAlign: 'right' }}>
        <Typography variant='caption'>
          &copy;{new Date().getFullYear()} by Richard Huffman
        </Typography>
      </Box>
    </footer>
  );
};

export default Footer;