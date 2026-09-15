import { BrowserRouter, Routes, Route } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Home from "@/pages/Home";
import { RiderRoutes } from "./Rider_Routes";
import { DriverRoutes } from "./Driver_Routes";

const queryClient = new QueryClient();

export default function RouterMain() {
  return (
    <QueryClientProvider client={queryClient}>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />


          <Route path="/rider/*" element={<RiderRoutes />} />
          <Route path="/driver/*" element={<DriverRoutes />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
