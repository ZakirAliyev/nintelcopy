import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-[100vh] flex justify-center items-center flex-col max-w-[70%] mx-auto  max-2xl:max-w-[65%] max-xl:max-w-[60%] max-lg:max-w-[90%]">
      <div className="grid grid-cols-3">
        <div className="col-span-1">
          <p className="text-[216px] font-medium rotate-[-15deg] text-center max-md:text-[89px]">
            4
          </p>
        </div>
        <div className="col-span-1">
          <img src="../assets/images/error.png" alt="" />
        </div>
        <div className="col-span-1">
          <p className="text-[216px] font-medium rotate-[15deg] text-center max-md:text-[89px]">
            4
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center flex-col">
        <p className=" text-[30px] font-bold max-md:text-[20px]">
        This page was not found
        </p>
        <Link
          className="px-4 py-3 my-8 hover:bg-[#6366f1] duration-300  bg-[#4f46e5] rounded-[12px] font-bold text-white text-[16px] max-md:text-[14px] max-md:px-2 max-md:py-2"
          to="/"
        >
       Return to home page
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
