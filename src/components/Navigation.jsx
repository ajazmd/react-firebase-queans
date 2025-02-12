import PropTypes from 'prop-types';
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from '../config/firebase';
import { signOut } from "firebase/auth";
import '../index.css';

const Navigation = ({ user }) => {
  const navigate = useNavigate(); // For redirecting after logout
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Handle Logout
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className='fw-bold' style={{ fontFamily: 'roboto' }}>
        QwickAsk
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {/* Always show Home and Ask links */}
            <Nav.Link as={Link} to="/" className={`nav-link-custom fw-semibold ${isActive('/') ? 'active' : ''}`}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/ask" className={`nav-link-custom fw-semibold ${isActive('/ask') ? 'active' : ''}`}>
              Ask Question
            </Nav.Link>

            {/* Conditionally render Login/Register or Profile dropdown */}
            {user ? (
              // If user is logged in, show profile dropdown
              <NavDropdown
                title={
                  user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      className="navbar-profile-image"
                    />
                  ) : (
                    <span className='fw-semibold'>{user.displayName.toUpperCase() || user.email || "User"}</span>
                  )
                }
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              // If user is not logged in, show Login and Register links
              <>
                <Nav.Link as={Link} to="/login" className={`nav-link-custom fw-semibold ${isActive('/login') ? 'active' : ''}`}>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className={`nav-link-custom fw-semibold ${isActive('/register') ? 'active' : ''}`}>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

Navigation.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    email: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Navigation;