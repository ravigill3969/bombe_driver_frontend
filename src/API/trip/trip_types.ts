export type AssignDriverRequestT = {
  rider_id: string;
  trip_id: string;
};

export type AssignDriverResponseT = {
  message: string;
  isSuccess: boolean;
};

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface RideDetails {
  durationSeconds: string;
  distanceMetrs: string;
  status: string;
}

export interface ActiveTripResponse {
  pickup: Location;
  dropoff: Location;
  rideDetails: RideDetails;
  driverFare: number;
  riderId: string;
  tripId: string;
}

export interface ErrorActiveTripResponse {
  error: string;
  isSuccess: false;
}

/**
 * The backend answers with an empty object when there is no active trip.
 * The API layer normalizes this shape into `null`.
 */
export type EmptyActiveTripResponse = Record<string, never>;

export type UpdateTripStatusToAssignedReqT = {
  trip_id: string;
};

export type UpdateTripStatusToAssignedResT = {
  message: string;
  isSuccess: boolean;
};

export type RiderPickedReq = {
  trip_id: string;
};

export type RiderPickedResT = {
  message: string;
  isSuccess: boolean;
};

export type TripCompletedReq = {
  trip_id: string;
  rider_id: string;
};

export type TripCompletedResT = {
  message: string;
  isSuccess: boolean;
};

export interface ActiveTripRiderResponse {
  pickup: Location;
  dropoff: Location;
  rideDetails: RideDetails;
  driverFare: number;
  riderId: string;
  tripId: string;
}

export interface CancelTripWithDriverIdRequest {
  driver_id: string;
  rider_id: string;
  trip_id: string;
  reason: string;
}

export interface DriversTodayEarningsResponse {
  message: string;
  isSuccess: boolean;
  data: {
    total_earning_today: number;
    total_trips_today: number;
  };
}
