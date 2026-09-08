import { Routes, Route, Outlet, Navigate } from "react-router";

// Context Providers
import {
  RiderInfoProvider,
  useRiderInfoContext,
} from "@/context/RiderInfoContext";
import { RiderMapProvider } from "@/context/map/RiderMapContext";

// Rider Pages
import RiderLogIn from "@/pages/Rider/Login";
import RiderRegister from "@/pages/Rider/Register";
import BookRide from "@/pages/Rider/BookRidePage";
import RiderInfo from "@/pages/Rider/RiderInfo";
import { WebSocketContextProvider } from "@/context/WebsocketContext";
import RiderActiveTrip from "@/pages/Rider/RiderActiveTrip";
import { RiderTripContextProvider } from "@/context/map/RiderTripContext";

// Auth Guard for Private Rider Routes
function ProtectedRiderRoutes() {
  const { isVerified } = useRiderInfoContext();

  if (!isVerified) {
    <Navigate to="/rider/login" replace />;
  }

  return <Outlet />;
}

export function RiderRoutes() {
  return (
    <RiderInfoProvider>
      <Routes>
        <Route path="register" element={<RiderRegister />} />
        <Route path="login" element={<RiderLogIn />} />
        <Route path="riderinfo" element={<RiderInfo />} />

        <Route element={<ProtectedRiderRoutes />}>
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
            path="/rider-active-trip"
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
