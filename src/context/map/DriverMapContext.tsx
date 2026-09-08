import { createContext, useContext, useEffect, type ReactNode } from "react";
import { MapboxProvider, useMapboxContext } from "@/context/map/MapboxContext";
import { useWebSocket } from "../WebsocketContext";
import { useDriverInfoContext } from "../DriverInfoContext";
import { useGetActiveTripWithDriverId } from "@/API/trip/trip_apis";
import type { ActiveTripResponse } from "@/API/trip/trip_types";

interface DriverMapContextValue {
  map: mapboxgl.Map | null;
  addContainer: (el: HTMLDivElement) => void;
  removeContainer: () => void;
  currentLocationCoords: { lat: number; lng: number } | undefined;
  locationError: boolean;
  tripData: ActiveTripResponse | undefined;
  isAvtiveTripFetchPending: boolean;
  isActiveTripFetchSuccess: boolean;
}

interface DataToSendOnLive {
  type: string;
  driver_id: string;
  rider_id?: string;
  ride_id?: string;
  is_online?: boolean;
  latitude?: number;
  longitude?: number;
  status: string;
}

const DriverMapContext = createContext<DriverMapContextValue | undefined>(
  undefined,
);

function DriverMapProviderInner({ children }: { children: ReactNode }) {
  const {
    driver: { isDriverOnline, sendData, setUserId },
  } = useWebSocket();
  const {
    map,
    addContainer,
    removeContainer,
    currentLocationCoords,
    locationError,
  } = useMapboxContext();

  const { driverInfo, isPending, isVerified } = useDriverInfoContext();
  const {
    isSuccess: isActiveTripFetchSuccess,
    isPending: isAvtiveTripFetchPending,
    data: tripData,
  } = useGetActiveTripWithDriverId();

  useEffect(() => {
    if (!isPending && isVerified && driverInfo?.driverId) {
      setUserId(driverInfo.driverId);
    }
  }, [isPending, isVerified, driverInfo?.driverId, setUserId]);

  useEffect(() => {
    if (!map || !currentLocationCoords) return;

    map.easeTo({
      center: [currentLocationCoords.lng, currentLocationCoords.lat],
      duration: 1000,
      zoom: 18,
    });
  }, [map, currentLocationCoords]);

  useEffect(() => {
    if (!isDriverOnline) return;

    const interval = setInterval(() => {
      if (currentLocationCoords == undefined) {
        return;
      }
      const dataToSend: DataToSendOnLive = {
        driver_id: driverInfo?.driverId as string,
        type: "LOCATION_UPDATE",
        is_online: isDriverOnline,
        latitude: currentLocationCoords?.lat,
        longitude: currentLocationCoords?.lng,
        ride_id: tripData ? tripData.tripId : "",
        rider_id: tripData ? tripData.riderId : "",
        status: tripData ? tripData.rideDetails.status : "",
      };
      sendData(dataToSend);
    }, 5000);

    return () => clearInterval(interval);
  }, [isDriverOnline, currentLocationCoords]);
  
  return (
    <DriverMapContext.Provider
      value={{
        map,
        addContainer,
        removeContainer,
        currentLocationCoords,
        locationError,
        isActiveTripFetchSuccess,
        isAvtiveTripFetchPending,
        tripData,
      }}
    >
      {children}
    </DriverMapContext.Provider>
  );
}

export function DriverMapProvider({ children }: { children: ReactNode }) {
  return (
    <MapboxProvider>
      <DriverMapProviderInner>{children}</DriverMapProviderInner>
    </MapboxProvider>
  );
}

export function useDriverMapContext() {
  const ctx = useContext(DriverMapContext);
  if (!ctx) {
    throw new Error(
      "useDriverMapContext must be used within a DriverMapProvider",
    );
  }
  return ctx;
}
