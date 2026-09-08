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
  tripId : string
}

export interface ErrorActiveTripResponse {
  error: string;
  isSuccess: false;
}

export type UpdateTripStatusToAssignedReqT= {
  trip_id: string;
};

export type UpdateTripStatusToAssignedResT = {
  message: string;
  isSuccess: boolean;
};

export type RiderPickedReq = {
  trip_id: string
}

export type RiderPickedResT = {
  message: string;
  isSuccess: boolean;
};

export type TripCompletedReq = {
  trip_id: string
}

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
  tripId : string
}



