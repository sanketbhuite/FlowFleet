import { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import api from "../../../api/axios";
import logo from "../../../components/logo.png";
import useAuth from "../../../hooks/useAuth";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";

// chart.js imports
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";


// register chart components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function Overview() {
  const { t } = useTranslation();

  const [stats, setStats] = useState({
    trucks: 0,
    trips: 0,
    revenue: 0,
    expenses: 0,
    profit: 0,
  });

  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      const [trucksRes, tripsRes, expensesRes] = await Promise.all([
        api.get("trucks/"),
        api.get("trips/"),
        api.get("expenses/"),
      ]);

      const totalRevenue = tripsRes.data.reduce(
        (sum, t) => sum + (t.revenue || 0),
        0
      );

      const totalExpenses = expensesRes.data.reduce(
        (sum, e) => sum + e.amount,
        0
      );

      setStats({
        trucks: trucksRes.data.length,
        trips: tripsRes.data.length,
        revenue: totalRevenue,
        expenses: totalExpenses,
        profit: totalRevenue - totalExpenses,
      });

      setExpenses(expensesRes.data);
      setTrips(tripsRes.data);
    };

    loadData();
  }, []);

  // group expenses by category
  const expenseByCategory = {};
  expenses.forEach((e) => {
    expenseByCategory[e.category] =
      (expenseByCategory[e.category] || 0) + e.amount;
  });

  return (
    <>
    {/* Greeting */}
      <h2 className="mb-4">
        {t("hello")}, <strong>{user?.username}</strong> 
      </h2>

       <Container
      fluid
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{ minHeight: "80vh" }}
    >
      
      {/* Center Image */}
      <img
        src={logo}
        alt="FleetFlow"
        style={{
          maxWidth: "300px",
          width: "100%",
          marginBottom: "20px",
        }}
      />

      {/* Intro Text */}
      <p className="text-muted" style={{ maxWidth: "600px" }}>
       {t("welcome_text")} 
      </p>
    </Container>
    {/* KPI CARDS */}
      <Row className="mb-4">
        <Col xs={12} sm={6} lg={3}>
          <Card body className="mb-3">
            <h6>{t("total_trucks")}</h6>
            <h4>{stats.trucks}</h4>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card body className="mb-3">
            <h6>{t("total_trips")}</h6>
            <h4>{stats.trips}</h4>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card body className="mb-3">
            <h6>{t("total_revenue")}</h6>
            <h4>₹{stats.revenue}</h4>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card body className="mb-3">
            <h6>{t("net_profit")}</h6>
            <h4
              className={
                stats.profit >= 0 ? "text-success" : "text-danger"
              }
            >
              ₹{stats.profit}
            </h4>
          </Card>
        </Col>
      </Row>


      {/* RECENT ACTIVITY */}
<Row>
  {/* Recent Trips */}
  <Col xs={12} lg={6}>
    <Card body className="mb-3">
      <h6>{t("recent_trips")}</h6>

      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>{t("truck")}</th>
              <th>{t("route")}</th>
              <th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {trips.slice(0, 5).map((t) => (
              <tr key={t.id}>
                <td>{t.truck}</td>
                <td>
                  {t.start_location} → {t.destination}
                </td>
                <td>{t.status}</td>
              </tr>
            ))}
            {trips.length === 0 && (
              <tr>
                <td colSpan="3" className="text-muted text-center">
                  {t("no_trips")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  </Col>

  {/* Recent Expenses */}
  <Col xs={12} lg={6}>
    <Card body className="mb-3">
      <h6>{t("recent_expenses")}</h6>

      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>{t("category")}</th>
              <th>{t("amount")}</th>
              <th>{t("description")}</th>
            </tr>
          </thead>
          <tbody>
            {expenses.slice(0, 5).map((e) => (
              <tr key={e.id}>
                <td>{e.category}</td>
                <td>₹{e.amount}</td>
                <td>{e.description}</td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan="3" className="text-muted text-center">
                  {t("no_expenses")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  </Col>
</Row>

    </>
  );
}