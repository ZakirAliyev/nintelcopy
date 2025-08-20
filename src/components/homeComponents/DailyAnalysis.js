import React from "react";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import DoughnutChart from "../charts/DoughnutChart";
import ApexChart from "../charts/ApexChart";
function DailyAnalysis({ loading, sentiment, newsCountByDate }) {
  return (
    <div className="grid grid-cols-3 gap-5 pb-4 max-md:grid-cols-1 max-md:gap-0 max-md:gap-y-4">
      {loading ? (
        <div className="skeleton h-[350px] rounded-[4px]"></div>
      ) : (
        <ErrorBoundary>
          <div className="col-span-1  bg-[#2a3042] max-md:h-[300px] w-full">
            <p className="text-[18px] text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
              Sentiment analysis
            </p>
            <div className="flex justify-center items-center h-full">
              <DoughnutChart sentiment={sentiment} />
            </div>
          </div>
        </ErrorBoundary>
      )}
      <div className="col-span-2 bg-[#2a3042]">
        {loading ? (
          <div className="skeleton h-[350px] rounded-[4px]"></div>
        ) : (
          <ErrorBoundary>
            <p className="text-[18px] mb-2 text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
              Daily share count
            </p>
            {newsCountByDate && (
              <ApexChart newsCountByDate={newsCountByDate} loading={loading} />
            )}
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

export default DailyAnalysis;
