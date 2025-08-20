import React, { Fragment, useEffect, useState } from "react";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { getKeywordsResults } from "../../redux/api/resultKeywords/resultActions";
import SplineChart from "../charts/SplineChart";
import { ClipLoader } from "react-spinners";
import PositiveNewsChart from "../charts/PositiveNewsChart";
import NegativeNewsChart from "../charts/NegativeNewsChart";
import { Helmet } from "react-helmet";
import DoughnutChartCompare from "../charts/DoughnutChartCompare";
import CompareResultsChart from "../charts/CompareResultsChart";
import { FcNeutralTrading } from "react-icons/fc";
import { FcPositiveDynamic } from "react-icons/fc";
import { FcNegativeDynamic } from "react-icons/fc";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import Button from "../button/Button";
import { useGetKeywordsQuery } from "../../redux/api/keywords";

function CompareKeywords() {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.getClicked.selectedKeywordId);
  const { data: getKeywordsRedux } = useGetKeywordsQuery({ id });
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [countsData, setCountsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // const getKeywordsRedux = useSelector((state) => state.getKeyword.keywordData);
  // try {
  //   const refresh_token =
  //     getKeywordsRedux &&
  //     getKeywordsRedux.message &&
  //     getKeywordsRedux.message.refresh_token
  //       ? getKeywordsRedux.message.refresh_token
  //       : "";
  //   if (refresh_token) {
  //     Cookies.set("token", JSON.parse(refresh_token));
  //   }
  //   const tokenFromCookie = Cookies.get("token");
  //   const tokenCookies = tokenFromCookie ? JSON.parse(tokenFromCookie) : null;
  //   accessTokenToSend = tokenCookies;
  // } catch (error) {
  //   console.error(error.message);
  // }
  const extractedKeywords =
    getKeywordsRedux &&
    Object.keys(getKeywordsRedux).map((key) => key.split(":")[0]);
  const [keywordResults, setKeywordResults] = useState({});

  const handleSelect = (selectedOptions) => {
    setSelectedKeywords(
      selectedOptions && selectedOptions.map((option) => option.value)
    );
  };
  useEffect(() => {
    setSelectedKeywords([]);
    setKeywordResults("");
  }, [id]);

  const handleCompare = () => {
    setLoading(true);
    Promise.all(
      selectedKeywords.map((keyword) =>
        dispatch(
          getKeywordsResults({
            keywordId: id,
            keyword: keyword,
          })
        )
      )
    )
      .then((responses) => {
        const combinedResults = {};
        responses &&
          responses.forEach((response, index) => {
            combinedResults[selectedKeywords[index]] = response.payload;
          });
        const sentiment = responses.map((value) => value.payload);
        const counts = {
          positive: {},
          negative: {},
          neutral: {},
        };
        selectedKeywords &&
          selectedKeywords.forEach((keyword) => {
            counts.positive[keyword] = 0;
            counts.negative[keyword] = 0;
            counts.neutral[keyword] = 0;
          });
        Object.values(sentiment).forEach((result, index) => {
          const keyword = selectedKeywords[index];
          result &&
            result.forEach((newsItem) => {
              if (
                counts[newsItem.sentiment] &&
                counts[newsItem.sentiment][keyword] !== undefined
              ) {
                counts[newsItem.sentiment][keyword]++;
              }
            });
        });
        setCountsData(counts);
        setLoading(false);
        setKeywordResults(combinedResults);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <Helmet>
        <title>Medialab | Compare keywords</title>
      </Helmet>
      <div>
        {getKeywordsRedux && (
          <Select
            options={extractedKeywords.map((keyword) => ({
              value: keyword,
              label: keyword,
            }))}
            isMulti
            onChange={handleSelect}
            value={selectedKeywords.map((keyword) => ({
              value: keyword,
              label: keyword,
            }))}
          />
        )}
      </div>
      <div className="inline-block">
        {loading ? (
          <div className="bg-[#626ed4]  gap-2 flex items-center hover:bg-[#535eb4] px-4 py-2 my-4 rounded-[8px]  duration-200 text-white">
            Loading
            <span className="flex items-center">
              <ClipLoader color="#41d3fa" size={18} />
            </span>
          </div>
        ) : (
          <Button
            className={`bg-[#626ed4] hover:bg-[#535eb4] px-4 py-2 my-4 rounded-[8px] duration-200 text-white ${
              selectedKeywords.length === 0
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
            onClick={handleCompare}
            disabled={selectedKeywords.length === 0}
          >
            Compare
          </Button>
        )}
      </div>
      {keywordResults && Object.keys(keywordResults).length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-4 my-6 max-md:grid-cols-1  max-md:gap-x-0 max-md:gap-y-4 max-md:my-0">
            <ErrorBoundary>
              <div className="col-span-2 bg-[#2a3042]">
                <p className="text-[18px] text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
                  Sentiment results
                </p>
                {keywordResults ? (
                  <div className="grid grid-cols-5 font-bold text-center items-center justify-between text-[#adb5bd] border-b-[1px] py-3">
                    <p>Keywords</p>
                    <p className="text-[#23b24b] flex justify-center items-center text-[24px]">
                      <FcPositiveDynamic />
                    </p>
                    <p className="text-[#ef3b42]  flex justify-center items-center text-[24px]">
                      {" "}
                      <FcNegativeDynamic />
                    </p>
                    <p className="text-[#e4aa1d]  flex justify-center items-center text-[24px]">
                      {" "}
                      <FcNeutralTrading />
                    </p>
                    <p>All</p>
                  </div>
                ) : (
                  ""
                )}
                <div className="flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar overflow-x-hidden">
                  {keywordResults &&
                    Object.entries(keywordResults).map(
                      ([keyword, results], index) => (
                        <p
                          key={index}
                          className="text-white grid grid-cols-5  items-center text-center justify-between py-2 border-b-[1px]"
                        >
                          <span>{keyword && keyword}</span>
                          <span className="text-[#23b24b]">
                            {countsData && countsData.positive[keyword]}
                          </span>
                          <span className="text-[#ef3b42]">
                            {countsData && countsData.negative[keyword]}
                          </span>
                          <span className="text-[#e4aa1d]">
                            {countsData && countsData.neutral[keyword]}
                          </span>
                          <span>
                            {results && results ? results.length : ""}
                          </span>
                        </p>
                      )
                    )}
                </div>
              </div>
            </ErrorBoundary>
            <ErrorBoundary>
              <div className="col-span-1  bg-[#2a3042] max-h-[400px] w-full ">
                <p className="text-[18px] text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
                  Sentiment analysis
                </p>
                <div className="flex justify-center items-center h-[350px]  w-full">
                  <DoughnutChartCompare countsData={countsData} />
                </div>
              </div>
            </ErrorBoundary>

            <ErrorBoundary>
              <div className="col-span-2 bg-[#2a3042]">
                <p className="text-[18px] text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
                  Sentiment chart
                </p>
                <SplineChart results={keywordResults} />
              </div>
            </ErrorBoundary>

            <ErrorBoundary>
              <div className="col-span-1  bg-[#2a3042] max-h-[400px] w-full ">
                <p className="text-[18px] text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
                  Sentiment analysis
                </p>
                <div className="flex justify-center items-center h-[350px] w-full">
                  <CompareResultsChart countsData={countsData} />
                </div>
              </div>
            </ErrorBoundary>
          </div>
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:mt-4">
            <ErrorBoundary>
              <div className="col-span-1 bg-[#2a3042]">
                <p className="text-[18px] text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
                  Positive chart
                </p>
                <PositiveNewsChart countsData={countsData} />
              </div>
            </ErrorBoundary>

            <ErrorBoundary>
              <div className="col-span-1 bg-[#2a3042]">
                <p className="text-[18px] text-white font-bold bg-[#626ed4] rounded-t-[8px] px-3 py-1">
                  Negative chart
                </p>
                <NegativeNewsChart countsData={countsData} />
              </div>
            </ErrorBoundary>
          </div>
        </>
      )}
    </Fragment>
  );
}

export default CompareKeywords;
