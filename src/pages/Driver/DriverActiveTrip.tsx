import {
  useUpdateTripStatusToPicked,
} from "@/API/trip/trip_apis";
import DriverMapView from "@/components/map/MapComponents/DriverMapView";
import NavDesktop from "@/components/nav/nav_desktop";
import { Button } from "@/components/ui/button";
import { useDriverTripContext } from "@/context/map/DriverTripContext";
import { useWebSocket } from "@/context/WebsocketContext";
import { useEffect } from "react";

function ActiveTrip() {
  const {
    isPending,
    hasActiveTrip,
    isDriverNearDropoff,
    isDriverNearPickup,
    trip_id,
    cancel_trip,
    complete_trip
  } = useDriverTripContext();
  const {
    driver: { setIsDriverOnline },
  } = useWebSocket();
  const { mutate } = useUpdateTripStatusToPicked();

  useEffect(() => {
    if (!isPending && hasActiveTrip) {
      setIsDriverOnline(true);
    }
  }, [isPending, hasActiveTrip, setIsDriverOnline]);

  return (
    <div className="flex flex-col h-screen overflow-hidden ">
      <NavDesktop NavFor="driver" />
      <div className="flex flex-col lg:flex-row overflow-hidden h-[80vh] mx-10 mt-10 rounded-2xl gap-5">
        <DriverMapView />
        {isDriverNearDropoff && (
          <Button onClick={() => complete_trip() }>Dropoff</Button>
        )}
        {isDriverNearPickup && (
          <Button onClick={() => mutate({ trip_id: trip_id })}> Pickup</Button>
        )}
        <Button onClick={()=> cancel_trip()}>Cancel </Button>
      </div>

    </div>
  );
}

export default ActiveTrip;
