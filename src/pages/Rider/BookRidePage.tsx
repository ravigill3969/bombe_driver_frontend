import NavRiderDesktop from "@/components/nav/nav_rider_desktop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSearchLocation, {
  type SearchLocationResT,
} from "@/hooks/useSearchLocation";
import { useState } from "react";

function BookRide() {
  const [pickup_location, setPickup_location] = useState<string>("");
  const [dropoff_location, setDropoff_location] = useState<string>("");

  const [suggested_pickup_locations, setSuggested_pickup_locations] = useState<
    SearchLocationResT[]
  >([]);
  const [suggested_dropoff_locations, setSuggested_dropoff_locations] =
    useState<SearchLocationResT[]>([]);

  for (let i = 0; i < suggested_pickup_locations.length; i++) {
    console.log(suggested_pickup_locations[i]);
  }

  const searchLocation = useSearchLocation();

  const search_pickup_location = async () => {
    const res: SearchLocationResT[] = await searchLocation(pickup_location);
    setSuggested_pickup_locations(res);
  };

  const search_dropoff_location = async () => {
    const res: SearchLocationResT[] = await searchLocation(dropoff_location);

    setSuggested_dropoff_locations(res);
  };

  return (
    <>
      <NavRiderDesktop />
      <div className="flex justify-center items-center h-screen ">
        <div className="border-2 shadow-2xl p-7 flex flex-col gap-6 border-gray-300 rounded-2xl w-xl ">
          <header className="text-xl font-bold">Book a ride</header>

          <div className="grid gap-2 relative">
            <Label>Pickup location</Label>

            <Input
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPickup_location(e.target.value);
                search_pickup_location();
              }}

              placeholder="Pickup location"
              type="pickup_location"
              className="rounded-xl"
              value={pickup_location}
            />
            {suggested_pickup_locations.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white rounded-md border border-gray-300 z-9999 max-h-80 overflow-y-auto mt-1 shadow">
                {suggested_pickup_locations.map((loc) => (
                  <div
                    key={loc.id}

                    onClick={() => {
                      setSuggested_pickup_locations([]);
                      setPickup_location(loc.fullName);
                    }}
                    className="p-3 cursor-pointer text-black border-b border-gray-200  hover:bg-gray-100"
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
              type="dropoff_location"
              value={dropoff_location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDropoff_location(e.target.value);
                search_dropoff_location();
              }}
            />
            {suggested_dropoff_locations.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white rounded-md border border-gray-300 z-9999 max-h-80 overflow-y-auto mt-1 shadow">
                {suggested_dropoff_locations.map((loc) => (
                  <div
                    key={loc.id}

                    onClick={() => {
                      setSuggested_dropoff_locations([]);
                      setDropoff_location(loc.fullName);
                    }}
                    className="p-3 cursor-pointer text-black border-b border-gray-200  hover:bg-gray-100"
                  >
                    {loc.fullName}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Number of passengers</Label>
            <Input
              placeholder="Number of passengers"
              type="number"
              max={"4"}
              min={"1"}
              defaultValue={1}
            />
          </div>

          <div>
            <Button>Search</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookRide;
