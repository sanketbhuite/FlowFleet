import { useEffect } from "react";
import api from "../../api/axios";

export default function SendLocation({ truckId }) {
  useEffect(() => {
    if (!truckId) return;

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition((pos) => {
        api.post("locations/", {
          truck: truckId,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      });
    };

    const interval = setInterval(sendLocation, 5000);
    return () => clearInterval(interval);
  }, [truckId]);

  return null;
}
