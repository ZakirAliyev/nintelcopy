import React, { Fragment, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useGetTopicDetailQuery } from "../../../redux/api/keywords";
function DetailSettingsLayout() {
  const clickedKeyword = sessionStorage.getItem("keywordId");
  const { data: detailTopic } = useGetTopicDetailQuery({ id: clickedKeyword });
  const title = detailTopic && detailTopic.data && detailTopic.data.title;
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
      <div className=" text-white">
        Selected keyword :{" "}
        <span className="font-bold text-[18px] ">{title && title}</span>
        <header>
          <div className="flex text-[#7d7780] gap-4 my-4 font-semibold">
            <NavLink
              className="bg-[#E4E9F7] hover:bg-[#887EFE] hover:text-white duration-200 px-2 py-1 rounded-[4px]"
              to="/settings-keyword"
              onClick={() => handleMoreClick("/settings-keyword")}
              style={{
                backgroundColor:
                  currentPath === "/settings-keyword" ? "#887EFE" : "",
                color: currentPath === "/settings-keyword" ? "white" : "",
              }}
            >
              Schedule report
            </NavLink>
            <NavLink
              className="bg-[#E4E9F7] hover:bg-[#887EFE] hover:text-white duration-200 px-2 py-1 rounded-[4px]"
              to="telegram-report"
              onClick={() =>
                handleMoreClick("/settings-keyword/telegram-report")
              }
              style={{
                backgroundColor:
                  currentPath === "/settings-keyword/telegram-report"
                    ? "#887EFE"
                    : "",
                color:
                  currentPath === "/settings-keyword/telegram-report"
                    ? "white"
                    : "",
              }}
            >
              Telegram report
            </NavLink>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </Fragment>
  );
}

export default DetailSettingsLayout;
