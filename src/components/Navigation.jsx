import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <Navbar expand="lg" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          💰 Finance Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link 
              as={NavLink} 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Dashboard
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/transactions" 
              className={location.pathname === '/transactions' ? 'active' : ''}
            >
              Transactions
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/budgets" 
              className={location.pathname === '/budgets' ? 'active' : ''}
            >
              Budgets
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/goals" 
              className={location.pathname === '/goals' ? 'active' : ''}
            >
              Goals
            </Nav.Link>
            <Nav.Link 
              as={NavLink} 
              to="/reports" 
              className={location.pathname === '/reports' ? 'active' : ''}
            >
              Reports
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
