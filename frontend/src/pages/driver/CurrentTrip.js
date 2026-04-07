import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Card, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import SendLocation from "./SendLocation";
import { useTranslation } from "react-i18next";

export default function CurrentTrip() {
  const { t: translate } = useTranslation();

  const [trip, setTrip] = useState(null);

  const fetchTrip = async () => {
    try {
      const res = await api.get("trips/");
      // Driver only sees assigned trips
      const active = res.data.find(
        (t) => t.status !== "COMPLETED"
      );
      setTrip(active || null);
    } catch {
      toast.error(translate("failed_load_trip"));
    }
  };

  useEffect(() => {
    fetchTrip();
  }, []);

  const startTrip = async () => {
    try {
      await api.patch(`trips/${trip.id}/start/`);
      toast.success(translate("trip_started"));
      fetchTrip();
    } catch {
      toast.error(translate("cannot_start_trip"));
    }
  };

  const completeTrip = async () => {
    try {
      await api.patch(`trips/${trip.id}/complete/`);
      toast.success(translate("trip_completed"));
      fetchTrip();
    } catch {
      toast.error(translate("cannot_complete_trip"));
    }
  };

  if (!trip) {
    return (
      <Card body className="mb-4">
        <h5>{translate("no_active_trip")}</h5>
      </Card>
    );
  }

 return (
  <Card body className="mb-4">
    <h5>{translate("current_trip")}</h5>
    <p><strong>{translate("from")}:</strong> {trip.start_location}</p>
    <p><strong>{translate("to")}:</strong> {trip.destination}</p>
    <p><strong>{translate("status")}:</strong> {translate(trip.status.toLowerCase())}</p>

    {trip.status === "PENDING" && (
      <Button onClick={startTrip}>
        {translate("start_trip")}
      </Button>
    )}

    {trip.status === "RUNNING" && (
      <>
        <Button variant="success" onClick={completeTrip}>
          {translate("complete_trip")}
        </Button>

        {/* 🔴 GPS SENDER — only when running */}
        <SendLocation truckId={trip.truck} />
      </>
    )}
  </Card>
);
}