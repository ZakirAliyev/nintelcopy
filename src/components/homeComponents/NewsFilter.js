import React from "react";
import ErrorBoundary from "../error-boundary/ErrorBoundary";

function NewsFilter({
  articles,
  loading,
  selectedNewsSource,
  handleNewsSourceChange,
  uniqueNewsSources,
  topNewsSites,
}) {
  const formatDateTime = (dateTime) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "UTC",
    };

    const formattedDateTime = new Intl.DateTimeFormat("en-US", options).format(
      new Date(dateTime)
    );

    return formattedDateTime;
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === "positive") {
      return "text-green-500";
    } else if (sentiment === "negative") {
      return "text-red-500";
    } else if (sentiment === "neutral") {
      return "text-yellow-500";
    } else {
      return "text-[#adb5bd]";
    }
  };

  return (
    <div className="grid grid-cols-3 gap-5 pb-4 max-md:grid-cols-1 max-md:gap-0 max-md:gap-y-4">
      {loading ? (
        <div className="skeleton h-[600px] rounded-[4px]"></div>
      ) : (
        <ErrorBoundary>
          <div className="h-max">
            <p className="text-[18px] text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
              Latest news
            </p>
            <div className="overflow-y-scroll overflow-x-hidden col-span-1  min-h-[100%] max-h-[600px] custom-scrollbar rounded-[4px]">
              {articles &&
                articles.map((news, index) => (
                  <a
                    target="_blank"
                    href={news.link}
                    rel="noreferrer"
                    key={index}
                    className="p-4 block mb-1 bg-[#2a3042]"
                  >
                    <p className="text-[#b0b6e9] font-medium line-clamp-2">
                      {news.title}
                    </p>
                    <div className="grid grid-cols-3 text-center py-2 text-[#adb5bd]">
                      <p className="text-[13px] text-start col-span-1">
                        {news && formatDateTime(news.published_at)}
                      </p>
                      <p
                        className={`text-[14px] col-span-1 ${getSentimentColor(
                          news.sentiment
                        )}`}
                      >
                        {news.sentiment}
                      </p>
                      <p className="text-[14px] col-span-1 line-clamp-1">
                        {news.source}
                      </p>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </ErrorBoundary>
      )}
      {loading ? (
        <div className="skeleton h-[600px] rounded-[4px]"></div>
      ) : (
        <ErrorBoundary>
          <div className="h-max">
            <div className="flex justify-between items-center text-[18px] text-white font-bold bg-[#626ed4]  rounded-t-[8px] px-3 py-1">
              <div>Most read</div>
              <div className="text-black font-light text-[15px]">
                {articles && (
                  <select
                    className="max-w-[150px] text-center outline-none bg-[#36394c] text-white rounded-[4px]"
                    onChange={handleNewsSourceChange}
                    value={selectedNewsSource}
                  >
                    {uniqueNewsSources &&
                      uniqueNewsSources.map((source, index) => (
                        <option value={source} key={index}>
                          {source}
                        </option>
                      ))}
                  </select>
                )}
              </div>
            </div>
            <div className="overflow-y-scroll overflow-x-hidden col-span-1   min-h-[100%] max-h-[600px] custom-scrollbar rounded-[4px]">
              {articles &&
                articles
                  .filter((news) => news.source === selectedNewsSource)
                  .map((filteredNews, index) => (
                    <a
                      target="_blank"
                      href={filteredNews.link}
                      rel="noreferrer"
                      className="p-4 block mb-1 bg-[#2a3042]"
                      key={index}
                    >
                      <p className="text-[#b0b6e9] font-medium line-clamp-2">
                        {filteredNews.title}
                      </p>
                      <div className="grid grid-cols-3 text-center py-2 text-[#adb5bd]">
                        <p className="text-[13px] text-start col-span-1">
                          {filteredNews &&
                            formatDateTime(filteredNews.published_at)}
                        </p>
                        <p
                          className={`text-[14px] col-span-1 ${getSentimentColor(
                            filteredNews.sentiment
                          )}`}
                        >
                          {filteredNews.sentiment}
                        </p>
                        <p className="text-[14px] col-span-1 line-clamp-1">
                          {filteredNews.source}
                        </p>
                      </div>
                    </a>
                  ))}
            </div>
          </div>
        </ErrorBoundary>
      )}
      {loading ? (
        <div className="skeleton h-[600px] rounded-[4px]"></div>
      ) : (
        <ErrorBoundary>
          <div className="h-max">
            <p className="text-[18px] text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
              Top news sites
            </p>
            <div className="overflow-y-scroll overflow-x-hidden col-span-1  min-h-[100%] max-h-[600px] custom-scrollbar rounded-[4px] ">
              {articles &&
                articles
                  .filter((news) => topNewsSites.includes(news.source))
                  .map((filteredNews, index) => (
                    <a
                      target="_blank"
                      href={filteredNews.link}
                      rel="noreferrer"
                      className="p-4  mb-1 bg-[#2a3042] block"
                      key={index}
                    >
                      <p className="text-[#b0b6e9] font-medium line-clamp-2">
                        {filteredNews.title}
                      </p>
                      <div className="grid grid-cols-3 text-center py-2 text-[#adb5bd]">
                        <p className="text-[13px] text-start col-span-1">
                          {filteredNews &&
                            formatDateTime(filteredNews.published_at)}
                        </p>
                        <p
                          className={`text-[14px] col-span-1 ${getSentimentColor(
                            filteredNews.sentiment
                          )}`}
                        >
                          {filteredNews.sentiment}
                        </p>
                        <p className="text-[14px] col-span-1 line-clamp-1">
                          {filteredNews.source}
                        </p>
                      </div>
                    </a>
                  ))}
            </div>
          </div>
        </ErrorBoundary>
      )}
    </div>
  );
}

export default NewsFilter;
