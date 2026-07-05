import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "@/pages/Home";
import LogIn from "@/pages/Login";
import Register from "@/pages/Register";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/login",
    element: <LogIn />,
  },
  {
    path: "/auth/register",
    element: <Register />,
  },
]);

function RouterMain() {
  return <RouterProvider router={router} />;
}

export default RouterMain;
