import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Table, Button, Form, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function Trucks() {
const { t } = useTranslation();
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [truckNumber, setTruckNumber] = useState("");
  const [model, setModel] = useState("");

  // ------------------------
  // FETCH TRUCKS
  // ------------------------
  const fetchTrucks = async () => {
    try {
      const res = await api.get("trucks/");
      setTrucks(res.data);
    } catch {
      toast.error(t("failed_load_trucks"));
    }
  };

  // ------------------------
  // FETCH DRIVERS (OWNER ONLY)
  // ------------------------
  const fetchDrivers = async () => {
    try {
      const res = await api.get("auth/drivers/");
      setDrivers(res.data);
    } catch {
      toast.error(t("failed_load_drivers"));
    }
  };

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => {
  fetchTrucks();
  fetchDrivers();
}, []);

  // ------------------------
  // ADD TRUCK
  // ------------------------
  const addTruck = async () => {
    if (!truckNumber || !model) {
      toast.error(t("all_fields_required"));
      return;
    }

    try {
      await api.post("trucks/", {
        truck_number: truckNumber,
        model,
      });

      toast.success(t("truck_added"));
      setTruckNumber("");
      setModel("");
      fetchTrucks();
    } catch {
      toast.error(t("failed_add_truck"));
    }
  };

  // ------------------------
  // ASSIGN DRIVER
  // ------------------------
  const assignDriver = async (truckId, driverId) => {
    if (!driverId) return;

    try {
      await api.patch(`trucks/${truckId}/assign-driver/`, {
        driver_id: driverId,
      });

      toast.success(t("driver_assigned"));
      fetchTrucks();
    } catch {
      toast.error(t("failed_assign_driver"));
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-3">{t("trucks")}</h5>

        {/* ADD TRUCK */}
        <Form className="d-flex gap-2 mb-3">
          <Form.Control
            placeholder={t("truck_number")}
            value={truckNumber}
            onChange={(e) => setTruckNumber(e.target.value)}
          />
          <Form.Control
            placeholder={t("model")}
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <Button onClick={addTruck}>{t("add")}</Button>
        </Form>

        {/* TRUCK LIST */}
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>{t("truck")}</th>
              <th>{t("model")}</th>
              <th>{t("assigned_driver")}</th>
              <th>{t("assign_driver")}</th>
            </tr>
          </thead>
          <tbody>
            {trucks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  {t("no_trucks")}
                </td>
              </tr>
            ) : (
              trucks.map((truck, i) => (
  <tr key={truck.id}>
    <td>{i + 1}</td>
    <td>{truck.truck_number}</td>
    <td>{truck.model}</td>
    <td>{truck.assigned_driver || "—"}</td>
    <td>
      <Form.Select
        defaultValue=""
        onChange={(e) =>
          assignDriver(truck.id, e.target.value)
        }
      >
        <option value="" disabled>
          {t("select_driver")}
        </option>
        {drivers.map((d) => (
          <option key={d.id} value={d.id}>
            {d.username}
          </option>
        ))}
      </Form.Select>
    </td>
  </tr>
))
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}