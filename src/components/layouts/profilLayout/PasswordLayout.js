import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
function PasswordLayout() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}

export default PasswordLayout;
