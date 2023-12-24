import React from "react";
import { Navigate } from "react-router-dom";
const PrivateRoute = ({ component: Component, ...rest }) => {
  // Add your authentication logic here
  if (localStorage.getItem("isAuthenticated")) {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/login" replace />;
  }
};
export default PrivateRoute;
