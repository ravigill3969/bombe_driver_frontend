import { Routes, Route, Outlet, Navigate } from "react-router";

// Context Providers
import {
  RiderInfoProvider,
  useRiderInfoContext,
} from "@/context/RiderInfoContext";
import { RiderMapProvider } from "@/context/map/RiderMapContext";
import { WebSocketContextProvider } from "@/context/WebsocketContext";
import { RiderTripContextProvider } from "@/context/map/RiderTripContext";

// Rider Pages
import RiderLogIn from "@/pages/Rider/Login";
import RiderRegister from "@/pages/Rider/Register";
import BookRide from "@/pages/Rider/BookRidePage";
import RiderInfo from "@/pages/Rider/RiderInfo";
import RiderActiveTrip from "@/pages/Rider/RiderActiveTrip";

function ProtectedRiderRoutes() {
  const { isVerified, isLoading } = useRiderInfoContext();

  if (isLoading) {
    return null;
  }

  if (!isVerified) {
    return <Navigate to="/rider/login" replace />;
  }

  return <Outlet />;
}

export function RiderRoutes() {
  return (
    <RiderInfoProvider>
      <Routes>
        <Route path="register" element={<RiderRegister />} />

        <Route path="login" element={<RiderLogIn />} />

        <Route element={<ProtectedRiderRoutes />}>
          <Route path="riderinfo" element={<RiderInfo />} />
          <Route
            path=""
            element={
              <WebSocketContextProvider>
                <RiderMapProvider>
                  <RiderTripContextProvider>
                    <BookRide />
                  </RiderTripContextProvider>
                </RiderMapProvider>
              </WebSocketContextProvider>
            }
          />

          <Route
            path="rider-active-trip"
            element={
              <WebSocketContextProvider>
                <RiderMapProvider>
                  <RiderTripContextProvider>
                    <RiderActiveTrip />
                  </RiderTripContextProvider>
                </RiderMapProvider>
              </WebSocketContextProvider>
            }
          />
        </Route>
      </Routes>
    </RiderInfoProvider>
  );
}
