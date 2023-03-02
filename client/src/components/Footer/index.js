import React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        &copy;{new Date().getFullYear()} by Richard Huffman
      </div>
      {/* space the height of toolbar after content (mobile) */}
      <Box sx={{ display: { sm: 'none'} }}>
        <Toolbar />
      </Box>
    </footer>
  );
};

export default Footer;