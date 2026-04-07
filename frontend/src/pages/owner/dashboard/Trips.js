import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Table, Card, Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Trips() {
  const { t } = useTranslation();

  const [trips, setTrips] = useState([]);
  const [trucks, setTrucks] = useState([]);

  const [form, setForm] = useState({
    truck: "",
    start_location: "",
    destination: "",
    distance_km: "",
    revenue: "",
  });

  const fetchTrips = async () => {
    try {
      const res = await api.get("trips/");
      setTrips(res.data);
    } catch {
      toast.error(t("failed_load_trips"));
    }
  };

  const fetchTrucks = async () => {
    try {
      const res = await api.get("trucks/");
      setTrucks(res.data);
    } catch {
      toast.error(t("failed_load_trucks"));
    }
  };

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchTrips();
  fetchTrucks();
}, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createTrip = async () => {
    if (
      !form.truck ||
      !form.start_location ||
      !form.destination ||
      !form.distance_km ||
      !form.revenue
    ) {
      toast.error(t("all_fields_required"));
      return;
    }

    try {
      await api.post("trips/", {
        truck: form.truck,
        start_location: form.start_location,
        destination: form.destination,
        distance_km: Number(form.distance_km),
        revenue: Number(form.revenue),
      });

      toast.success(t("trip_created"));

      setForm({
        truck: "",
        start_location: "",
        destination: "",
        distance_km: "",
        revenue: "",
      });

      fetchTrips();
    } catch (err) {
      toast.error(err.response?.data?.detail || t("failed_create_trip"));
    }
  };

  return (
    <Card>
      <Card.Body>
        <h5>{t("create_trip")}</h5>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Select
              name="truck"
              value={form.truck}
              onChange={handleChange}
            >
              <option value="">{t("select_truck")}</option>
              {trucks.map((truck) => (
                <option key={truck.id} value={truck.id}>
                  {truck.truck_number}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={3}>
            <Form.Control
              placeholder={t("start_location")}
              name="start_location"
              value={form.start_location}
              onChange={handleChange}
            />
          </Col>

          <Col md={3}>
            <Form.Control
              placeholder={t("destination")}
              name="destination"
              value={form.destination}
              onChange={handleChange}
            />
          </Col>

          <Col md={3}>
            <Form.Control
              placeholder={t("distance_km")}
              name="distance_km"
              type="number"
              value={form.distance_km}
              onChange={handleChange}
            />
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={3}>
            <Form.Control
              placeholder={t("revenue")}
              name="revenue"
              type="number"
              value={form.revenue}
              onChange={handleChange}
            />
          </Col>

          <Col md={3}>
            <Button onClick={createTrip}>{t("create_trip")}</Button>
          </Col>
        </Row>

        <hr />

        <h5>{t("trips")}</h5>

        <Table bordered>
          <thead>
            <tr>
              <th>#</th>
              <th>{t("truck")}</th>
              <th>{t("from")}</th>
              <th>{t("to")}</th>
              <th>{t("distance")}</th>
              <th>{t("revenue")}</th>
              <th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip, i) => (
              <tr key={trip.id}>
                <td>{i + 1}</td>
                <td>{trip.truck}</td>
                <td>{trip.start_location}</td>
                <td>{trip.destination}</td>
                <td>{trip.distance_km} km</td>
                <td>₹{trip.revenue}</td>
                <td>{trip.status}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}