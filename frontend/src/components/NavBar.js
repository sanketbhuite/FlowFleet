import { Navbar as BSNavbar, Nav, Container } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
// import { useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import i18n from "i18next";

export default function Navbar() {
  const { logout } = useAuth();
  // const navigate = useNavigate();

  return (
    <BSNavbar bg="dark" variant="dark">
      <Container>
        <BSNavbar.Brand><b style={{ color: '#33c0b2' }}>Flow</b> Fleet</BSNavbar.Brand>
        <Nav className="ms-auto">
          {/* <Nav.Link onClick={() => navigate(`/${user.role.toLowerCase()}`)}>
            Dashboard
          </Nav.Link> */}
             {/* Language Switch */}
        <div className="d-flex justify-content-end mb-3">
          <Form.Select
            style={{ width: "150px", color: "aliceblue", margin: "6px 25px 0px 0px", backgroundColor: "#2b2f32" }}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            defaultValue={i18n.language}
          >
            <option value="en">English</option>
            <option value="mr">मराठी</option>
          </Form.Select>
        </div>
          <Nav.Link onClick={logout}>Logout</Nav.Link>
        </Nav>
      </Container>
    </BSNavbar>
  );
}
