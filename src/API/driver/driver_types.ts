export type LoginT = {
  email: string;
  password: string;
};

export type LoginRes = {
  isSuccess: boolean;
  message: string;
};

export type DriverInfo = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string;
  license_no: string;
  image_url: string;
};

export type VehicleInfo = {
  carname: string;
  brand: string;
  model: string;
  make: string;
  year: number;
  color: string;
  car_plate: string;
  insurance_policy_no: string;
};

export type DriverRegisterRequest = {
  driver_info: DriverInfo;
  car_info: VehicleInfo;
};
