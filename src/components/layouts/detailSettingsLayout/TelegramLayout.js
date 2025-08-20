import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";
function TelegramLayout() {
  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
}

export default TelegramLayout;
