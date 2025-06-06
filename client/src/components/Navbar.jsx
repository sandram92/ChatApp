import { Container, Navbar, Nav, Stack, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  

  
  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">
            Chat App
          </Link>
        </h2>
        {user && user.name && (
          <span className="text-warning">Logged in as {user.name}</span>
        )}
        <Nav>
          <Stack direction="horizontal" gap={2}>
            {user ? (
              <Button variant="outline-warning" onClick={() => logoutUser()}>
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login" className="link-light text-decoration-none">
                  Login
                </Link>
                <Link to="/register" className="link-light text-decoration-none">
                  Register
                </Link>
              </>
            )}
      
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
