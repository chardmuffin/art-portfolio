import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <footer>
      <Box sx={{ display: 'block', textAlign: 'right' }}>
        <Typography>
          &copy;{new Date().getFullYear()} by Richard Huffman
        </Typography>

        {/* space the height of toolbar after content (mobile) */}
        <Box sx={{ display: { sm: 'none' } }}>
          <Toolbar />
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;