import { BACKEND_WEBSOCKET_API } from "@/global/env";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface DriverI {
  sendData: (data: unknown) => void;
  setIsDriverOnline: (val: boolean) => void;
  isDriverOnline: boolean;
  setUserId: (val: string) => void;
  tripDataOfferRequestForDriver: TripDataOfferRequestToDriverT | null;
}

interface RiderI {
  setUserId: (val: string) => void;
  driver_location: {
    lng: number;
    lat: number;
  } | null;
}

interface WebSocketContextType {
  webSocketError: string | null;
  driver: DriverI;
  rider: RiderI;
}

type RideDetails = {
  distance_meters: number;
  duration_seconds: number;
  service_type: string;
  driver_location: {
    lng: number;
    lat: number;
  };
};

type Location = {
  address: string;
  latitude: number;
  longitude: number;
};

type TripDataOfferRequestToDriverT = {
  type: string;
  driver_fare: number;
  ride_details: RideDetails;
  pickup: Location;
  dropoff: Location;
  rider_id: string;
  trip_id: string;
};

interface AssignedDriverLocationUpdate {
  driver_id: string;
  latitude: number;
  longitude: number;
  ride_id: string;
  rider_id: string;
  status: string;
  type: string;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const socket = useRef<WebSocket | null>(null);
  const [webSocketError, setWebSocketError] = useState<string | null>(null);

  const [isDriverOnline, setIsDriverOnline] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [tripDataOfferRequestForDriver, setTripDataOfferRequestForDriver] =
    useState<TripDataOfferRequestToDriverT | null>(null);

  const [driver_location, setDriverLocation] = useState<{
    lng: number;
    lat: number;
  } | null>(null);

  useEffect(() => {
    if (!userId) return;
    const ws = new WebSocket(`${BACKEND_WEBSOCKET_API}/ws?user_id=${userId}`);

    ws.onopen = () => {
      setWebSocketError(null);
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log(data);

      if ((data.type as string) == "RIDE_REQUEST_TO_DRIVER") {
        const reqDataForDriver: TripDataOfferRequestToDriverT = data;
        setTripDataOfferRequestForDriver(reqDataForDriver);
      }

      if ((data.type as string) == "ASSIGNED_DRIVER_LOCATION_UPDATE") {
        const info: AssignedDriverLocationUpdate = data;
        setDriverLocation({
          lat: info.latitude,
          lng: info.longitude,
        });
      }
    };

    ws.onerror = (error) => {
      setWebSocketError("websocket error");
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    socket.current = ws;

    return () => {
      ws.close();
    };
  }, [userId]);

  const sendData = (data: unknown) => {
    if (socket.current?.readyState !== WebSocket.OPEN) {
      console.log("WebSocket is not connected");
      return;
    }

    socket.current.send(JSON.stringify(data));
  };

  return (
    <WebSocketContext.Provider
      value={{
        webSocketError,
        driver: {
          isDriverOnline,
          sendData,
          setIsDriverOnline,
          setUserId,
          tripDataOfferRequestForDriver,
        },
        rider: {
          setUserId,
          driver_location,
        },
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error(
      "useWebSocket must be used inside WebSocketContextProvider",
    );
  }

  return context;
}
