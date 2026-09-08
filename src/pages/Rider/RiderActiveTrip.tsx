import RiderMapView from "@/components/map/MapComponents/RiderMapView";
import NavDesktop from "@/components/nav/nav_desktop";

function RiderActiveTrip() {


  return (
    <div className="flex flex-col h-screen overflow-hidden ">
      <NavDesktop NavFor="rider" />
      <div className="flex flex-col lg:flex-row overflow-hidden h-[80vh] mx-10 mt-10 rounded-2xl gap-5">
        <RiderMapView />
      </div>
    </div>
  );
}

export default RiderActiveTrip;
