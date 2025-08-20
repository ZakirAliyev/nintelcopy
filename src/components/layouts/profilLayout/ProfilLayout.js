import React, { useState, useEffect, Fragment } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
function ProfilLayout() {
  const location = useLocation();
  const { pathname } = location;
  const [currentPath, setCurrentPath] = useState(pathname);
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);
  const handleMoreClick = (path) => {
    setCurrentPath(path);
  };
  return (
    <Fragment>
      <p className="text-[1.5rem] mb-4 font-semibold text-white">Settings</p>
      <header className="flex gap-8 font-semibold mb-4 text-[#7d7780]">
        <NavLink
          className="bg-[#E4E9F7] hover:bg-[#887EFE] hover:text-white duration-200 px-2 py-1 rounded-[4px]"
          to="/settings"
          onClick={() => handleMoreClick("/settings")}
          style={{
            backgroundColor: currentPath === "/settings" ? "#887EFE" : "",
            color: currentPath === "/settings" ? "white" : "",
          }}
        >
          Profile
        </NavLink>
        <NavLink
          className="bg-[#E4E9F7] hover:bg-[#887EFE] hover:text-white duration-200 px-2 py-1 rounded-[4px]"
          to="changepassword"
          onClick={() => handleMoreClick("/settings/changepassword")}
          style={{
            backgroundColor:
              currentPath === "/settings/changepassword" ? "#887EFE" : "",
            color: currentPath === "/settings/changepassword" ? "white" : "",
          }}
        >
          Password
        </NavLink>
      </header>
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
}

export default ProfilLayout;
