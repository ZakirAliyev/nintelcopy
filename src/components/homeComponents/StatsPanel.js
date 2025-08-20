import React  from "react";
import { ClipLoader } from "react-spinners";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
function StatsPanel({
  loading,
  percentageChange,
  percentageDifference,
  articles,
  sentimentFilter,
  lastMonthData,
}) {
  return (
    <div className="grid grid-cols-3 gap-5 pb-4  max-md:grid-cols-1 max-md:gap-4">
      <ErrorBoundary>
        <div className="col-span-1 relative px-5 py-7 rounded-[4px] text-white bg-[#626ed4]">
          <div
            className={`popular absolute right-0 top-7 text-[15px] text-white flex justify-center items-center w-[100px] h-[35px] ${
              percentageChange > 0 ? "bg-[#02a499]" : "bg-red-600"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center w-[100px] h-[35px]">
                <ClipLoader color="white" size={18} />
              </div>
            ) : (
              <>
                {percentageChange > 0
                  ? `+${percentageChange.toPrecision(3)}`
                  : `${percentageChange.toPrecision(3)}`}{" "}
                %
              </>
            )}
          </div>
          <div className="flex gap-5">
            <div className="w-[58px] h-[58px] bg-[#7984db] rounded-[4px] flex justify-center items-center">
              <img
                className=" max-w-[32px] max-h-[34px]"
                src="../assets/images/c1.png"
                alt=""
              />
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-[17px] font-semibold uppercase text-[#b0b6e9]">
                Results
              </p>
              <p className="text-[24px]  font-medium text-center">
                {loading ? (
                  <ClipLoader color="white" size={18} />
                ) : (
                  articles && articles.length
                )}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-between  text-[#abb6e8]">
            <p className="text-[14px]">During the selected interval</p>
          
          </div>
        </div>
      </ErrorBoundary>
      <ErrorBoundary>
        <div className="col-span-1 relative px-5 py-7 rounded-[4px] text-white bg-[#626ed4]">
          <div
            className={`popular absolute right-0 top-7 text-[15px] text-white flex justify-center items-center w-[100px] h-[35px] ${
              percentageChange > 0 ? "bg-[#02a499]" : "bg-red-600"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center w-[100px] h-[35px]">
                <ClipLoader color="white" size={18} />
              </div>
            ) : (
              <>
                {percentageDifference > 0
                  ? `+${percentageDifference.toPrecision(3)}`
                  : `${percentageDifference.toPrecision(3)}`}{" "}
                %
              </>
            )}
          </div>
          <div className="flex gap-5">
            <div className="w-[58px] h-[58px] bg-[#7984db] rounded-[4px] flex justify-center items-center">
              <img
                className=" max-w-[32px] max-h-[34px]"
                src="../assets/images/c1.png"
                alt=""
              />
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-[17px] font-semibold uppercase text-[#b0b6e9]">
                Source
              </p>
              <p className="text-[24px]  font-medium text-center">
                {loading ? (
                  <ClipLoader color="white" size={18} />
                ) : (
                  sentimentFilter && sentimentFilter
                )}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-between  text-[#abb6e8]">
            <p className="text-[14px]">During the selected interval</p>
          </div>
        </div>
      </ErrorBoundary>
      <ErrorBoundary>
        <div className="col-span-1 relative px-5 py-7 rounded-[4px] text-white bg-[#626ed4]">
          <div className="flex gap-5">
            <div className="w-[58px] h-[58px] bg-[#7984db] rounded-[4px] flex justify-center items-center">
              <img
                className=" max-w-[32px] max-h-[34px]"
                src="../assets/images/c1.png"
                alt=""
              />
            </div>
            <div className="flex flex-col justify-between">
              <p className="text-[17px] font-semibold uppercase text-[#b0b6e9]">
                Results
              </p>
              <p className="text-[24px]  font-medium text-center">
                {loading ? (
                  <ClipLoader color="white" size={18} />
                ) : (
                  lastMonthData && lastMonthData.length
                )}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-between  text-[#abb6e8]">
            <p className="text-[14px]">Since last month</p>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default StatsPanel;
