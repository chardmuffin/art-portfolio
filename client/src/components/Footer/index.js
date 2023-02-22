import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        &copy;{new Date().getFullYear()} by Richard Huffman
      </div>
    </footer>
  );
};

export default Footer;