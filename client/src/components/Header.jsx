import { Container, Navbar, Col, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

 
function Intestazione (props) {
  return(
    <Navbar bg='primary' data-bs-theme='dark'>
      <Container fluid>
        <Col>
          <Navbar.Brand>Budget Sociale</Navbar.Brand>
        </Col>
        {props.fase == 1 && props.login && <Col className="d-flex justify-content-center">
          <Navbar.Brand>BUDGET TOTALE: {props.budget}€ </Navbar.Brand>
        </Col>}
        <Col className="d-flex justify-content-end">
          <Navbar.Brand>
          {props.login ? 
          <LogoutButton logout={props.handleLogout} /> :
          <Link to='/login'className='btn btn-outline-light'>Login</Link>
          }
          </Navbar.Brand>
        </Col>
      </Container>
    </Navbar>
  );
}

function LogoutButton(props) {
  return(
    <Button variant='outline-light' onClick={props.logout}>Logout</Button>
  )
}

export default Intestazione;