import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const logout = event => {
    event.preventDefault();

  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/">
          <h1>Home</h1>
        </Link>

        <nav className="text-center">
          {/* if logged in */}
          <Link to="/profile">My Account</Link>
          <a href="/" onClick={logout}>
            Logout
          </a>

          {/* else */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;