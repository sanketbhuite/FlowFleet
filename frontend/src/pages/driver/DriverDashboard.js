import Navbar from "../../components/NavBar";
import CurrentTrip from "./CurrentTrip";
import Expenses from "./Expenses";
import { Container, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export default function DriverDashboard() {
  return (
    <>
      <Navbar />

      <Container className="mt-4">
      <CurrentTrip />
        <Expenses />
      </Container>
    </>
  );
}