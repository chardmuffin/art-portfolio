import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const logout = event => {
    event.preventDefault();

  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/"><h1>Home</h1></Link>

        <nav className="text-center">
          <Link to="/search">Search</Link>
          <Link to="/checkout">Cart</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;