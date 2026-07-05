import Home from "@/pages/Home";
import LogIn from "@/pages/Login";
import Register from "@/pages/Register";

import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    children: [
      { index: true, Component: Home },
      {
        path: "auth",
        Component: Water,
        children: [
          { path: "login", Component: LogIn },
          { path: "register", Component: Register },
        ],
      },
    ],
  },
]);

function RouterMain() {
  return (
    <>
      <RouterProvider router={router} />,
    </>
  );
}

function Water() {
  return <div> water</div>;
}

export default RouterMain;
