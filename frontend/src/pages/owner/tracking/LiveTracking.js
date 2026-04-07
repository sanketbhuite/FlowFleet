import { useEffect, useState, useCallback } from "react";
import api from "../../../api/axios";
import { Card, Form } from "react-bootstrap";
import MapView from "../../../components/MapView";
import { toast } from "react-toastify";
import "./LiveTracking.css";
import { useTranslation } from "react-i18next";

export default function LiveTracking() {
  const { t: translate } = useTranslation();

  const [trucks, setTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState("");
  const [location, setLocation] = useState(null);

  const fetchTrucks = async () => {
    const res = await api.get("trucks/");
    setTrucks(res.data);
  };

const fetchLocation = useCallback(async () => {
  if (!selectedTruck) return;

  try {
    const res = await api.get("locations/");
    const latest = res.data.find(
      (l) => l.truck === Number(selectedTruck)
    );
    setLocation(latest || null);
  } catch {
    toast.error(translate("failed_fetch_location"));
  }
}, [selectedTruck, translate]);

  useEffect(() => {
    fetchTrucks();
  }, []);

  // Poll every 5 seconds
useEffect(() => {
  const interval = setInterval(fetchLocation, 5000);
  return () => clearInterval(interval);

}, [fetchLocation]);
      
  return (
    <Card className="mt-4">
      <Card.Body>
          <h5 className="mb-3">{translate("live_truck_tracking")}</h5>

        <Form.Select
          className="mb-3"
          value={selectedTruck}
          onChange={(e) => setSelectedTruck(e.target.value)}
        >
          <option value="">{translate("select_truck")}</option>
          {trucks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.truck_number}
            </option>
          ))}
        </Form.Select>

        {location ? (
          <div className="map-container">
          <MapView
            latitude={location.latitude}
            longitude={location.longitude}
          />
          </div>
        ) : (
          <p>{translate("no_location_data")}</p>
        )}
      </Card.Body>
    </Card>
  );
}