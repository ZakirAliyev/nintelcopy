import { Navigate } from "react-router-dom";
import { getToken } from "../auth/token/getToken";

function GuestRouter({ element: Element, ...rest }) {
  const refreshToken = getToken();
  const isLoggedIn = refreshToken;

  return isLoggedIn ? <Navigate to="/" /> : <Element {...rest} />;
}

export default GuestRouter;
