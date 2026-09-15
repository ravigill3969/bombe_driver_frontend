import { Routes, Route, Navigate, Outlet } from "react-router";

import { DriverMapProvider } from "@/context/map/DriverMapContext";

// Driver Pages
import DriveHome from "@/pages/Driver/DriverHome";
import DriverLogIn from "@/pages/Driver/Login";
import DriverRegister from "@/pages/Driver/Register";
import {
  DriverInfoProvider,
  useDriverInfoContext,
} from "@/context/DriverInfoContext";
import DriverInfo from "@/pages/Driver/DriverInfo";
import { WebSocketContextProvider } from "@/context/WebsocketContext";
import ActiveTrip from "@/pages/Driver/DriverActiveTrip";
import DriverTripContextProvider from "@/context/map/DriverTripContext";
import TodayIncome from "@/pages/Driver/TodayIncome";

function ProtectedDriverRoutes() {
  const { isVerified, isPending } = useDriverInfoContext();

  if (isPending) {
    return;
  }

  if (!isVerified) {
    return <Navigate to="/driver/login" />;
  }

  return <Outlet />;
}

export function DriverRoutes() {
  return (
    <DriverInfoProvider>
      <Routes>
        <Route element={<ProtectedDriverRoutes />}>
          <Route
            path=""
            element={
              <WebSocketContextProvider>
                <DriverMapProvider>
                  <DriverTripContextProvider>
                    <DriveHome />
                  </DriverTripContextProvider>
                </DriverMapProvider>
              </WebSocketContextProvider>
            }
          />
          <Route
            path="active-trip"
            element={
              <WebSocketContextProvider>
                <DriverMapProvider>
                  <DriverTripContextProvider>
                    <ActiveTrip />
                  </DriverTripContextProvider>
                </DriverMapProvider>
              </WebSocketContextProvider>
            }
          />
          <Route path="driverinfo" element={<DriverInfo />} />
          <Route path="/today-income" element={<TodayIncome />} />
        </Route>
        <Route path="register" element={<DriverRegister />} />
        <Route path="login" element={<DriverLogIn />} />
      </Routes>
    </DriverInfoProvider>
  );
}
