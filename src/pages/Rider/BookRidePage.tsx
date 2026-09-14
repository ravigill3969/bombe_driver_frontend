import NavDesktop from "@/components/nav/nav_desktop";
import RiderSearchComponent from "@/components/map/MapComponents/RiderSearchComponent";
import RiderMapView from "@/components/map/MapComponents/RiderMapView";
import RideOptionsPanel from "@/components/rides/RideOptionsPanel";
import { useRiderMapContext } from "@/context/map/RiderMapContext";
import { useRiderTripContext } from "@/context/map/RiderTripContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";
function BookRide() {
  const { showRidesWithFare } = useRiderMapContext();
  const navigate = useNavigate();
  const { isPending, hasActiveTrip } = useRiderTripContext();

  useEffect(() => {
    if (!isPending && hasActiveTrip) {
      navigate("/rider/rider-active-trip");
    }
  }, [isPending, hasActiveTrip, navigate]);

  return (
    <div className="flex flex-col min-h-screen lg:h-screen lg:overflow-hidden">
      <NavDesktop NavFor="rider" isRiderVerified={true} />

      <div className="flex flex-col lg:flex-row flex-1 items-stretch gap-6 lg:gap-7 w-[95%] mx-auto py-4 lg:py-6 min-h-0">
        <div className="w-full lg:w-[35%] lg:h-full lg:overflow-y-auto shrink-0">
          <RiderSearchComponent />
        </div>

        <div className="relative w-full lg:w-[65%] h-[450px] lg:h-full rounded-2xl overflow-hidden shadow-lg shrink-0 lg:shrink mb-6 lg:mb-0">
          <RiderMapView />
          {showRidesWithFare && <RideOptionsPanel />}
        </div>
      </div>
      {/*<Button onClick={() => sendData("water")}>fwevrwvc</Button>*/}
    </div>
  );
}

export default BookRide;
