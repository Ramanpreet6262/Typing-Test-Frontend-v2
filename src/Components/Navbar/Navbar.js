import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import './Navbar.css';

const navbar = props => {
  return (
    <Navbar bg='dark' variant='dark' expand='lg' sticky='top'>
      <Navbar.Brand as={Link} to='/'>
        Typing Test
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Nav className='ml-auto'>
          {props.isAuthenticated ? (
            <>
              <NavItem>
                <Nav.Link as={Link} to='/profile'>
                  Profile
                </Nav.Link>
              </NavItem>
              <NavItem className='logout-link' onClick={props.handleLogout}>
                Logout
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <Nav.Link as={Link} to='/signup'>
                  Signup
                </Nav.Link>
              </NavItem>
              <NavItem>
                <Nav.Link as={Link} to='/login'>
                  Login
                </Nav.Link>
              </NavItem>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default navbar;
