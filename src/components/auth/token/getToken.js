import Cookies from "js-cookie";

export function getToken() {
  const tokenData = Cookies.get("token");
  return tokenData && tokenData ? JSON.parse(tokenData) : null;
}

export const setToken = (token) => {
  Cookies.set("token", JSON.stringify(token));
};
