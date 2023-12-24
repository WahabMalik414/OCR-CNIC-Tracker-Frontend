import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Home.tsx";
import ViewRecords from "./viewRecords.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login.tsx";
import PrivateRoute from "./privateRoute.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute component={App} />,
  },
  {
    path: "/view",
    element: <PrivateRoute component={ViewRecords} />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
