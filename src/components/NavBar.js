import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import './NavBar.css';

const NavBar = () => {
    return (
        <Navbar expand="lg">
            <Container>
                <Navbar.Brand href="/" id="logo">LOGO</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link id="nav-item" href="/">Home</Nav.Link>
                    <Nav.Link id="nav-item" href="/analyze">Analyze</Nav.Link>
                    <Nav.Link id="nav-item" href="/">History</Nav.Link>
                    <Nav.Link id="nav-item" href="/">Account</Nav.Link>
                </Nav>
            </Container>
        </Navbar>
    )
}

export default NavBar;