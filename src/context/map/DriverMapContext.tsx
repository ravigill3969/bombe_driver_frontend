import { createContext, useContext, useEffect, useRef, type ReactNode } from "react";
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
  tripData: ActiveTripResponse | null | undefined;
  isAvtiveTripFetchPending: boolean;
  hasActiveTrip: boolean;
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
    isPending: isAvtiveTripFetchPending,
    data: tripData,
  } = useGetActiveTripWithDriverId();

  // The query resolves with `null` when the driver has no active trip (the
  // backend answers with `{}`), but React Query still reports that as a
  // successful fetch. Routing and trip UI care about whether a trip actually
  // exists, so derive that from the data instead of relying on `isSuccess`.
  const hasActiveTrip = tripData != null;

  // `sendData` is recreated on every render of the websocket provider, so keep
  // it in a ref — referencing it directly would reset the interval below on
  // every render and it might never fire.
  const sendDataRef = useRef(sendData);
  useEffect(() => {
    sendDataRef.current = sendData;
  }, [sendData]);

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
        type: "LOCATION_UPDATE_FROM_DRIVER",
        is_online: isDriverOnline,
        latitude: currentLocationCoords?.lat,
        longitude: currentLocationCoords?.lng,
        ride_id: tripData ? tripData.tripId : "",
        rider_id: tripData ? tripData.riderId : "",
        status: tripData ? tripData.rideDetails.status : "",
      };
      sendDataRef.current(dataToSend);
    }, 5000);

    return () => clearInterval(interval);
  }, [isDriverOnline, currentLocationCoords, tripData, driverInfo?.driverId]);

  return (
    <DriverMapContext.Provider
      value={{
        map,
        addContainer,
        removeContainer,
        currentLocationCoords,
        locationError,
        hasActiveTrip,
        isAvtiveTripFetchPending,
        tripData ,
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
