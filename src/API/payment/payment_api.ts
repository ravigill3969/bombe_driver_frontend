import { BACKEND_API } from "@/global/env";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type {
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from "./payment_types";

const useCreateCheckOutSession = () => {
  const createCheckoutSession = async (
    data: CreateCheckoutSessionRequest,
  ): Promise<CreateCheckoutSessionResponse> => {
    const response = await fetch(
      `${BACKEND_API}/payment/create-checkout-session`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const res = await response.json();
    console.log(res);
    if (!response.ok) {
      const errorMessage =
        res.message || res.error || "Error creating checkout session";
      throw new Error(errorMessage);
    }

    return res;
  };

  return useMutation({
    mutationKey: ["createCheckoutSession"],
    mutationFn: createCheckoutSession,

    onSuccess: (data) => {
      window.location.href = data.data.url;
    },

    onError: (err) => {
      console.log(err);
      toast.error(err.message);
    },
  });
};

export default useCreateCheckOutSession;
