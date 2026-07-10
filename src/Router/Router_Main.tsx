import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "@/pages/Home";
import LogIn from "@/pages/Rider/Login";
import Register from "@/pages/Driver/Register";
import UberMap from "@/components/map/Map";
import BookRide from "@/pages/Rider/BookRidePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LogIn />,
  },
  {
    path: "/driver/register",
    element: <Register />,
  },
  {
    path: "/on-route",
    element: <UberMap />,
  },
  {
    path: "/book",
    element:<BookRide />
  }
]);

function RouterMain() {
  return <RouterProvider router={router} />;
}

export default RouterMain;
