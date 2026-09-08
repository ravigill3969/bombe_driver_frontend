import { MapPin, Navigation, Clock, Route, Car } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWebSocket } from "@/context/WebsocketContext";
import { useAssignTripToDriver } from "@/API/trip/trip_apis";

function TripDetails() {
  const {
    driver: { tripDataOfferRequestForDriver },
  } = useWebSocket();

  const { mutate } = useAssignTripToDriver();

  if (!tripDataOfferRequestForDriver) {
    return null;
  }

  const ride = tripDataOfferRequestForDriver;

  const distanceKm = (ride.ride_details.distance_meters / 1000).toFixed(1);

  const durationMinutes = Math.ceil(ride.ride_details.duration_seconds / 60);

  const fare = (ride.driver_fare / 100).toFixed(2);

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
      <Card className="overflow-hidden rounded-2xl border shadow-xl">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between bg-muted/40 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              New Ride Request
            </p>

            <h2 className="text-2xl font-bold">${fare}</h2>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
            <Car className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>

        <CardContent className="space-y-5 p-5">
          {/* Ride stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <Route className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Distance</p>

                <p className="font-semibold">{distanceKm} km</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
              <Clock className="h-5 w-5 text-muted-foreground" />

              <div>
                <p className="text-xs text-muted-foreground">Duration</p>

                <p className="font-semibold">{durationMinutes} min</p>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-4">
            {/* Pickup */}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <MapPin className="h-5 w-5" />
                <div className="mt-1 h-full w-px bg-border" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  PICKUP
                </p>

                <p className="truncate text-sm font-medium">
                  {ride.pickup.address}
                </p>
              </div>
            </div>

            {/* Dropoff */}
            <div className="flex gap-3">
              <Navigation className="mt-0.5 h-5 w-5" />

              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  DROPOFF
                </p>

                <p className="truncate text-sm font-medium">
                  {ride.dropoff.address}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Service type */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Service</span>

            <span className="font-medium capitalize">
              {ride.ride_details.service_type}
            </span>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-11 rounded-xl">
              Decline
            </Button>

            <Button
              className="h-11 rounded-xl"
              onClick={() => {
                mutate({
                  rider_id: ride.rider_id,
                  trip_id: ride.trip_id,
                });
              }}
            >
              Accept Ride
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TripDetails;
