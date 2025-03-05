import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import './NavBar.css';
import { useLocation } from 'react-router-dom';

const NavBar = () => {
    const location = useLocation();

    return (
        <Navbar>
            <Container className='nav-container'>
                <Navbar.Brand href="/" id="logo">LOGO</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link id="nav-item" href="/" className={location.pathname === '/' ? 'active' : 'inactive'}>Home</Nav.Link>
                    <Nav.Link id="nav-item" href="/analyze" className={location.pathname === '/analyze' ? 'active' : 'inactive'}>Analyze</Nav.Link>
                    <Nav.Link id="nav-item" href="/history" className={location.pathname === '/history' ? 'active' : 'inactive'}>History</Nav.Link>
                    <Nav.Link id="nav-item" href="/account" className={location.pathname === '/account' ? 'active' : 'inactive'}>Account</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar;