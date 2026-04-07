import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import { List } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
export default function OwnerLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const { logout } = useAuth();
const navigate = useNavigate();
const { t } = useTranslation();
const handleLogout = () => {
  logout();
  navigate("/login");
};

  return (
    <Container fluid>
      {/* MOBILE HEADER */}
      <div className="d-md-none bg-dark text-white p-2 d-flex align-items-center">
        <Button
          variant="outline-light"
          size="sm"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <List />
        </Button>
        <span className="ms-2 fw-bold">FleetFlow</span>
      </div>

      <Row>
        {/* SIDEBAR */}
        <Col
          md={2}
          className={`bg-dark text-white min-vh-100 p-3 ${
            showSidebar ? "d-block" : "d-none"
          } d-md-block`}
        >
<h5 className="mb-2">FlowFleet</h5>

<select
  className="form-select form-select-sm mb-3"
  onChange={(e) => i18n.changeLanguage(e.target.value)}
  defaultValue={i18n.language}
>
  <option value="en">English</option>
  <option value="mr">मराठी</option>
</select>

<small className="text-secondary">{t("operations")}</small>

<NavLink to="/owner" className="nav-link text-white">
  {t("dashboard")}
</NavLink>

<NavLink to="/owner/trucks" className="nav-link text-white">
  {t("trucks")}
</NavLink>

<NavLink to="/owner/trips" className="nav-link text-white">
  {t("trips")}
</NavLink>

<hr />

<small className="text-secondary">{t("live_tracking")}</small>

<NavLink to="/owner/tracking" className="nav-link text-white">
  {t("live_tracking")}
</NavLink>

<hr />

<small className="text-secondary">{t("expenses")}</small>

<NavLink to="/owner/expenses" className="nav-link text-white">
  {t("expenses")}
</NavLink>

<NavLink to="/owner/expenses/add" className="nav-link text-white">
  {t("add_expense")}
</NavLink>

<NavLink to="/owner/expenses/reports" className="nav-link text-white">
  {t("reports")}
</NavLink>

<button
  onClick={handleLogout}
  className="btn btn-outline-light btn-sm w-100"
>
  {t("logout")}
</button>

        </Col>

        {/* MAIN CONTENT */}
        <Col md={10} className="p-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
