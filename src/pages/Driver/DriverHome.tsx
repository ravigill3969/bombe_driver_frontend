import DriveLiveButton from "@/components/Driver/DriveLiveButton";
import DriverMapView from "@/components/map/MapComponents/DriverMapView";
import NavDesktop from "@/components/nav/nav_desktop";
import { useDriverTripContext } from "@/context/map/DriverTripContext";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

function DriveHome() {
  const { isPending, hasActiveTrip } = useDriverTripContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      !isPending &&
      hasActiveTrip &&
      location.pathname !== "/driver/active-trip"
    ) {
      navigate("/driver/active-trip");
    }
  }, [isPending, hasActiveTrip, location.pathname, navigate]);
  return (
    <div className="flex flex-col h-screen overflow-hidden ">
      <NavDesktop NavFor="driver" />
      <div className="flex flex-col lg:flex-row overflow-hidden h-[80vh] mx-10 mt-10 rounded-2xl gap-5">
        <DriverMapView />
        <DriveLiveButton />
      </div>
    </div>
  );
}

export default DriveHome;
