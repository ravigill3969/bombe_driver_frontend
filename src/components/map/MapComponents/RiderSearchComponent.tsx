import useSearchLocation, {
  type SearchLocationResT,
} from "@/hooks/useSearchLocation";
import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { useRiderMapContext } from "@/context/map/RiderMapContext";

export interface locationDataFromUserI {
  pickup_location: string;
  dropoff_location: string;
  pickup_coords: [number, number];
  dropoff_coords: [number, number];
}

function RiderSearchComponent() {
  const {
    setPickup_coords,
    setDropoff_cords,
    PickupLocationNameFunc,
    DropoffLocationNameFunc,
    pickupLocationName,
    dropoffLocationName,
    bringRouteToCenter,
    bringFocusOnMap,
    currentLocationCoords,
    ShowRidesWithFareFunc,
  } = useRiderMapContext();

  const [suggested_pickup_locations, setSuggested_pickup_locations] = useState<
    SearchLocationResT[]
  >([]);
  const [suggested_dropoff_locations, setSuggested_dropoff_locations] =
    useState<SearchLocationResT[]>([]);

  const searchLocation = useSearchLocation();

  const search_pickup_location = async (query: string) => {
    if (!query.trim()) {
      setSuggested_pickup_locations([]);
      return;
    }
    const res: SearchLocationResT[] = await searchLocation(query);

    if (currentLocationCoords) {
      setSuggested_pickup_locations([
        {
          coordinates: [currentLocationCoords.lng, currentLocationCoords.lat],
          fullName: "Use current location",
          id: "current-location-id",
          name: "Current Location",
        },
        ...res,
      ]);
    } else {
      setSuggested_pickup_locations(res);
    }
  };

  const search_dropoff_location = async (query: string) => {
    if (!query.trim()) {
      setSuggested_dropoff_locations([]);
      return;
    }
    const res: SearchLocationResT[] = await searchLocation(query);
    setSuggested_dropoff_locations(res);
  };

  const onFocusCick = () => {
    bringFocusOnMap();
    bringRouteToCenter();
    ShowRidesWithFareFunc(true);
  };

  return (
    <div className="border-2 shadow-2xl p-7 flex flex-col gap-6 border-gray-300 rounded-2xl w-full">
      <header className="text-xl font-bold">Book a ride</header>

      {/* Pickup Input */}
      <div className="grid gap-2 relative">
        <Label>Pickup location</Label>

        <Input
          placeholder="Pickup location"
          className="rounded-xl"
          value={pickupLocationName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value;
            PickupLocationNameFunc(query);
            search_pickup_location(query);
            ShowRidesWithFareFunc(false);
          }}
        />
        {suggested_pickup_locations.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white rounded-md border border-gray-300 z-50 max-h-80 overflow-y-auto mt-1 shadow">
            {suggested_pickup_locations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => {
                  setSuggested_pickup_locations([]);
                  PickupLocationNameFunc(loc.fullName);
                  setPickup_coords(loc.coordinates);
                  ShowRidesWithFareFunc(false);
                }}
                className="p-3 cursor-pointer text-black border-b border-gray-200 hover:bg-gray-100"
              >
                {loc.fullName}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-2 relative">
        <Label>Dropoff location</Label>
        <Input
          placeholder="Dropoff location"
          value={dropoffLocationName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value;
            DropoffLocationNameFunc(query);
            search_dropoff_location(query);
          }}
        />
        {suggested_dropoff_locations.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white rounded-md border border-gray-300 z-50 max-h-80 overflow-y-auto mt-1 shadow">
            {suggested_dropoff_locations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => {
                  setSuggested_dropoff_locations([]);
                  DropoffLocationNameFunc(loc.fullName);
                  setDropoff_cords(loc.coordinates);

                }}
                className="p-3 cursor-pointer text-black border-b border-gray-200 hover:bg-gray-100"
              >
                {loc.fullName}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Button
          onClick={onFocusCick}

          className="w-[50%] py-6 rounded-2xl"
        >
          Search Rides
        </Button>
      </div>
    </div>
  );
}

export default RiderSearchComponent;
