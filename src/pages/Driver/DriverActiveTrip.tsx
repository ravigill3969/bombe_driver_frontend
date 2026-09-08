import {
  useCompletedTrip,
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
    isSuccess,
    isDriverNearDropoff,
    isDriverNearPickup,
    trip_id,
  } = useDriverTripContext();
  const {
    driver: { setIsDriverOnline },
  } = useWebSocket();
  const { mutate } = useUpdateTripStatusToPicked();
  const { mutate : tripCompletedMutate } = useCompletedTrip();

  useEffect(() => {
    if (!isPending && isSuccess) {
      setIsDriverOnline(true);
    }
  }, [isPending, isSuccess, setIsDriverOnline]);

  return (
    <div className="flex flex-col h-screen overflow-hidden ">
      <NavDesktop NavFor="driver" />
      <div className="flex flex-col lg:flex-row overflow-hidden h-[80vh] mx-10 mt-10 rounded-2xl gap-5">
        <DriverMapView />
        {isDriverNearDropoff && (
          <Button onClick={() => tripCompletedMutate({ trip_id: trip_id })}>Dropoff</Button>
        )}
        {isDriverNearPickup && (
          <Button onClick={() => mutate({ trip_id: trip_id })}> Pickup</Button>
        )}
      </div>
    </div>
  );
}

export default ActiveTrip;
