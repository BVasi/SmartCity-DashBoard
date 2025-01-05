import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavbarComponent() {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand as={Link} to="/">Smart City Dashboard</Navbar.Brand>
      <Nav className="ml-auto">
        <Nav.Link as={Link} to="/login">Login</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default NavbarComponent;
