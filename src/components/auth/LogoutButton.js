import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Button from "../button/Button";
import { useLogoutMutation } from "../../redux/api/auth";
function LogoutButton({ style }) {
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  // const tokenCookies = JSON.parse(Cookies.get("token"));
  // let accessTokenToSend = tokenCookies;
  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response.data.status === true) {
        Object.keys(Cookies.get()).forEach((cookieName) => {
          Cookies.remove(cookieName);
        });
        navigate("/signin");
      }
      // const refresh_token =
      //   response &&
      //   response.payload.message &&
      //   response.payload.message.refresh_token;
      // if (refresh_token) {
      //   Cookies.set("token", JSON.stringify(refresh_token));
      // }
      // const tokenFromCookie = Cookies.get("token");
      // const tokenCookies = tokenFromCookie ? JSON.parse(tokenFromCookie) : null;
      // accessTokenToSend = tokenCookies;
      // if (refresh_token) {
      //   await dispatch(fetchLogout({ access_token: tokenCookies }));
      //   Object.keys(Cookies.get()).forEach((cookieName) => {
      //     Cookies.remove(cookieName);
      //   });
      //   navigate("/signin");
      // }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <Fragment>
      <Button
        style={style}
        className="flex  px-4 py-3 w-full hover:bg-[#32394e] text-white  duration-200"
        onClick={handleLogout}
      >
        Sign out
      </Button>
    </Fragment>
  );
}

export default LogoutButton;
