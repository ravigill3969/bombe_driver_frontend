export type LoginT = {
  email: string;
  password: string;
};

export type LoginRes = {
  isSuccess: boolean;
  message: string;
};

export interface RiderRegisterRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone_number: string;
  image_url: string;
  home_address: string;
  work_address: string;
}