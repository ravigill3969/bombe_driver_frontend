import { useWebSocket } from "@/context/WebsocketContext";
import { Button } from "../ui/button";
import TripDetails from "./TripDetails";

function DriveLiveButton() {
  const {
    driver: { isDriverOnline, setIsDriverOnline },
  } = useWebSocket();

  const GoLiveOrOffline = (val: boolean) => {
    setIsDriverOnline(val);
  };

  return (
    <div className="w-full lg:w-[20%] flex items-start justify-center p-4">
      {!isDriverOnline ? (
        <>
          <Button
            className="w-full h-16 font-bold text-xl"
            onClick={() => GoLiveOrOffline(true)}
          >
            Go online
          </Button>
        </>
      ) : (
        <div className="w-full flex flex-col  items-center ">
          <div className="w-full">
            <Button
              className="w-full h-16 font-bold flex-1  text-xl bg-red-600 hover:bg-red-500"
              onClick={() => GoLiveOrOffline(false)}
            >
              Go offline
            </Button>
          </div>

          <div>
            <TripDetails />
          </div>
        </div>
      )}
    </div>
  );
}

export default DriveLiveButton;
