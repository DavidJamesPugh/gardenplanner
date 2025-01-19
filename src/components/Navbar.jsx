import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
          <h1 style={styles.logo}>
            <Link to="/" style={styles.link}>
              Garden Planner
            </Link>
          </h1>
          <div style={styles.dropdown}>
            <button
              onClick={toggleDropdown}
              style={styles.dropdownButton}
            >
              Menu ▼
            </button>
            {dropdownOpen && (
              <div style={styles.dropdownMenu}>
                <Link to="/" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  Create Garden
                </Link>
                {isLoggedIn ?
                  (
                    <>
                      <Link to="/my-gardens" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        My Gardens
                      </Link>
                    </>
                  ) :
                  (
                    <>
                      <Link to="/login" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        Login
                      </Link>
                    </>
                  )}
                <Link to="/vegetable-library" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                  Vegetable Library
                </Link>
              </div>
            )}
          </div>
        </div>
    </nav>
);
};

const styles = {
  navbar: {
    background: '#3c3c3c',
    color: '#fff',
    height: '60px', // Explicit height for the navbar
    padding: '0 20px', // Vertical padding removed for consistent height
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center', // Vertically centers all children
    maxWidth: '1000px',
    height: '100%', // Ensures children align with the navbar height
    margin: '0 auto',
  },
  logo: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'relative',
  },
  dropdownButton: {
    background: '#3c3c3c',
    border: 'none',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: '5px 10px',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: '#fff',
    color: '#3c3c3c',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    overflow: 'hidden',
    zIndex: 1001,
  },
  dropdownItem: {
    display: 'block',
    padding: '10px 15px',
    textDecoration: 'none',
    color: '#3c3c3c',
    whiteSpace: 'nowrap',
    fontSize: '1rem',
  },
};



export default Navbar;
