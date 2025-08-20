import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../auth/token/getToken";
function PrivateRouter() {
  const refreshToken = getToken();
  return refreshToken ? <Outlet /> : <Navigate to="/signin" />;
}
export default PrivateRouter;
