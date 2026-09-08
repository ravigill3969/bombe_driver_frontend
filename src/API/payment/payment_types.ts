export type ServiceType =
  | "SERVICE_TYPE_UNSPECIFIED"
  | "SERVICE_TYPE_ECONOMY"
  | "SERVICE_TYPE_COMFORT"
  | "SERVICE_TYPE_XL";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address: string;
}

export interface FareDetails {
  amountInCents: number;
  currency: string;
}

// message RideDetails {
//   int64 duration_seconds = 1;
//   int64 distance_metrs = 2;
// }
//
export interface RideDetails {
  durationSeconds: number;
  distanceMetrs: number;
}

export interface CreateCheckoutSessionRequest {
  serviceType: ServiceType;
  pickup: GeoLocation ;
  dropoff: GeoLocation;
  fare: FareDetails;
  ride_details: RideDetails;
}

export interface CreateCheckoutSessionResponse {
  message: string;
  isSuccess: boolean;
  data: {
    url: string;
  };
}
