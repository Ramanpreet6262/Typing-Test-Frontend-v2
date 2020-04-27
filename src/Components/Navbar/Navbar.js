import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import './Navbar.css';

const navbar = props => {
  return (
    <div className='navigation container'>
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to='/'>Typing Test</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {props.isAuthenticated ? (
              <NavItem onClick={props.handleLogout}>Logout</NavItem>
            ) : (
              <>
                <LinkContainer to='/signup'>
                  <NavItem>Signup</NavItem>
                </LinkContainer>
                <LinkContainer to='/login'>
                  <NavItem>Login</NavItem>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default navbar;
