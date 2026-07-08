import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "@/pages/Home";
import LogIn from "@/pages/Rider/Login";
import Register from "@/pages/Rider/Register";

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
    path: "/register",
    element: <Register />,
  },
]);

function RouterMain() {
  return <RouterProvider router={router} />;
}

export default RouterMain;
