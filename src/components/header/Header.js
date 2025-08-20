import React, { useState, useEffect, useRef, Fragment, memo } from "react";
import { NavLink } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import Cookies from "js-cookie";
import Interval from "./İnterval";
import { useDispatch} from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import MyBottomSheet from "./BottomSheet";
import "../styles/spring.css";
import Button from "../button/Button";
import { useGetTopicsQuery } from "../../redux/api/keywords";
import { setClickedKeyword } from "../../redux/api/clickedKeyword/getClickedActions";
const Header = () => {
  const dispatch = useDispatch();
  const { data: topicsRedux } = useGetTopicsQuery();
  const keywordRedux = topicsRedux && topicsRedux.data;
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKeywordId, setSelectedKeywordId] = useState(null);
  const [open, setOpen] = useState(true);
  useEffect(() => {
    setOpen(false);
  }, []);
  function onDismiss() {
    setOpen(true);
  }
  useEffect(() => {
    const handleWindowResize = () => {
      if (open && window.innerWidth > 768) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [open]);

  const dropdownRef = useRef(null);
  const userId = Cookies.get("user");
  // const userDataId = userId ? JSON.parse(userId).id : null;
  const userName = userId ? JSON.parse(userId).firstname : null;
  const userLastname = userId ? JSON.parse(userId).lastname : null;
  const userInitial = userName ? userName.charAt(0).toUpperCase() : null;

  const lastnameInitial = userLastname
    ? userLastname.charAt(0).toUpperCase()
    : null;
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    const setDefaultKeyword = () => {
      if (!selectedKeywordId && keywordRedux ? keywordRedux.length > 0 : "") {
        const defaultKeywordId =
          keywordRedux &&
          keywordRedux.length > 0 &&
          keywordRedux[0] &&
          keywordRedux[0].id
            ? keywordRedux[0].id
            : "";
        sessionStorage.setItem("keywordId", defaultKeywordId);
        dispatch(setClickedKeyword(defaultKeywordId));
      }
    };
    setDefaultKeyword();
  }, [keywordRedux, selectedKeywordId,dispatch]);
  const handleKeywordChange = (e) => {
    const newKeywordId = e.target.value;
    setSelectedKeywordId(newKeywordId);
    dispatch(setClickedKeyword(newKeywordId));
  };
  useEffect(() => {
    const keywordIdFromSessionStorage = sessionStorage.getItem("keywordId");
    if (keywordIdFromSessionStorage) {
      setSelectedKeywordId(keywordIdFromSessionStorage);
    }
  }, []);

  useEffect(() => {
    if (selectedKeywordId) {
      sessionStorage.setItem("keywordId", selectedKeywordId);
    }
  }, [selectedKeywordId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Fragment>
      <div className="flex  justify-between items-center w-full max-md:hidden">
        <div className="flex gap-12">
          <NavLink className="max-md:hidden" to="/">
            <img
              className="h-[50px]"
              src="../assets/images/logo_white.png"
              alt=""
            />
          </NavLink>
          <select
            onChange={handleKeywordChange}
            className="max-w-[250px] min-w-[200px] max-md:hidden duration-200 bg-[#36394c] border-[#6e727d] text-white border-[1px] text-center rounded-[4px] outline-none max-md:h-[40px]"
            value={selectedKeywordId || ""}
          >
            {keywordRedux &&
              keywordRedux.map((keyword) => (
                <option
                  className="border-[2px]"
                  key={keyword && keyword.id}
                  value={keyword && keyword.id}
                >
                  {keyword && keyword.title}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center gap-8 max-md:hidden">
          <Interval />
          <div ref={dropdownRef} className="relative inline-block z-50">
            <Button
              className="text-white min-w-[170px] px-4 py-1 border-[#6e727d] rounded font-bold border-[1px]"
              onClick={toggleMenu}
            >
              <div className="flex items-center justify-around gap-2">
                <span className="bg-[#222736]  rounded-[15%]  px-3 py-2">
                  <span>{userInitial}</span>
                  <span>{lastnameInitial}</span>
                </span>
                <div className="">
                  <span className="text-[#adb5bd]">{userName && userName}</span>
                </div>
              </div>
            </Button>

            {isOpen && (
              <div className="absolute flex flex-col bg-[#2a3042]  text-white border border-[#343b51] mt-2  w-full rounded">
                <NavLink
                  to="/settings"
                  className="px-4 py-3 hover:bg-[#32394e] cursor-pointer"
                >
                  Settings
                </NavLink>
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-md:flex max-md:justify-between w-full hidden ">
        <div className="hidden max-md:block"></div>
        <NavLink className=" hidden max-md:block" to="/">
          <img
            className="h-[50px]"
            src="../assets/images/logo_white.png"
            alt=""
          />
        </NavLink>
        <Button className="elvinEl " onClick={() => setOpen(!open)}>
          {open ? <BsThreeDotsVertical /> : <BsThreeDotsVertical />}
        </Button>
      </div>

      <MyBottomSheet
        open={open}
        onDismiss={onDismiss}
        selectedKeywordId={selectedKeywordId}
        keywordRedux={keywordRedux}
        handleKeywordChange={handleKeywordChange}
      />
    </Fragment>
  );
};

export default memo(Header);
