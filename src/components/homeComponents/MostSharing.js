import React from "react";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import ApexChart2 from "../charts/Chart";
function MostSharing({ source, loading }) {
  return (
    <div className="grid grid-cols-3 gap-5 pb-4 max-md:grid-cols-1 max-md:gap-0 max-md:gap-y-4">
      {loading ? (
        <div className="skeleton h-[350px] rounded-[4px] "></div>
      ) : (
        <ErrorBoundary>
          <div>
            <p className="text-[18px] text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
              Most sharing sites
            </p>
            <div className="col-span-1 bg-[#2a3042] flex flex-col overflow-y-scroll overflow-x-hidden custom-scrollbar h-[350px] text-gray-400">
              {source &&
                Object.keys(source).length > 0 &&
                Object.entries(source)
                  .sort(([, a], [, b]) => b - a)
                  .map(([key, value], index) => (
                    <div className="py-3 px-4 grid grid-cols-2" key={index}>
                      <span className="col-span-1">{key}</span>
                      <span className="col-span-1 text-center">{value}</span>
                    </div>
                  ))}
            </div>
          </div>
        </ErrorBoundary>
      )}
      <div className="col-span-2  bg-[#2a3042]">
        {loading ? (
          <div className="skeleton h-[350px] rounded-[4px]"></div>
        ) : (
          <ErrorBoundary>
            <p className="text-[18px]  text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
              Most sharing top 12 site
            </p>
            {source && <ApexChart2 source={source} loading={loading} />}
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

export default MostSharing;
