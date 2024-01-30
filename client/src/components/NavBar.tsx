import React from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import {Link} from "react-router-dom";

const MyNavbar: React.FC = () => {
    return (
      <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
        <Container>
          <h2>
            <Link to="/" className="link-light text-decoration-none">MSL Relay</Link>
          </h2>
          <span className = "text-warning">Logged in as Charles</span>
          <Nav>
            <Stack direction="horizontal" gap={3}>
                <Link to="/Login" className="link-light text-decoration-none">Login</Link>
                <Link to="/Register" className="link-light text-decoration-none">Register</Link>
                <Link to="/Chat" className="link-light text-decoration-none">Chat</Link>
            </Stack>
          </Nav>
        </Container>
      </Navbar>
    );
  };

export default MyNavbar;
