import React, { Fragment, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
// import DoughnutChart from "../charts/DoughnutChart";
import BubbleChart from "../charts/BubbleChart";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// import ApexChart from "../charts/ApexChart";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import * as XLSX from "xlsx";
import { Helmet } from "react-helmet";
import Cookies from "js-cookie";
import { ClipLoader } from "react-spinners";
import ErrorBoundary from "../error-boundary/ErrorBoundary";
import Button from "../button/Button";
import {
  useGetArticlesQuery,
  // useGetSentimentQuery,
  useGetSourceQuery,
} from "../../redux/api/census";
import { useSelector } from "react-redux";
function ResultKeywords() {
  const location = useLocation();
  // const keywordId = location.state && location.state.keywordId;
  const keywordId = sessionStorage.getItem("keywordId");
  const selectedDates = useSelector((state) => state.interval.selectedDates);
  const dataStart = selectedDates.length > 0 && selectedDates[0];
  const dataEnd = selectedDates.length > 0 && selectedDates[1];
  const {
    data: articlesData,
    refetch: refetchArticles,
    isLoading: articlesLoading,
  } = useGetArticlesQuery({
    id: keywordId,
    dataStart,
    dataEnd,
  });
  // const { data: sentimentData } = useGetSentimentQuery({
  //   id: keywordId,
  //   dataStart,
  //   dataEnd,
  // });
  const { data: sourceData, refetch: refetchSource } = useGetSourceQuery({
    id: keywordId,
    dataStart,
    dataEnd,
  });

  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const initialKeywordId = sessionStorage.getItem("keywordId");
  const baseUrl = process.env.REACT_APP_BASE_URL;
  ////////////  Generate pdf start//////////////////
  const tokenCookies = JSON.parse(Cookies.get("token"));
  const downloadPdf = async () => {
    try {
      setLoadingPdf(true);
      const response = await fetch(
        `${baseUrl}/download-pdf/${initialKeywordId}/${dataStart}/${dataEnd}`,
        {
          headers: {
            Authorization: `Bearer ${tokenCookies}`,
          },
        }
      );
      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoadingPdf(false);
    }
  };
  /////////////////////Generate pdf end///////////////////////

  ////////////////// Generate excel start////////////////
  const downloadExcel = async () => {
    setLoadingExcel(true);
    try {
      const response = await fetch(
        `${baseUrl}/download-excel/${initialKeywordId}/${dataStart}/${dataEnd}`,
        {
          headers: {
            Authorization: `Bearer ${tokenCookies}`,
          },
        }
      );
      const blob = await response.blob();
      const excelUrl = URL.createObjectURL(blob);
      window.open(excelUrl, "_blank");
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoadingExcel(false);
    }
  };
  //////////////////////Generate excel end///////////////////////////
  // const generateExcel = () => {
  //   const workbook = XLSX.utils.book_new();
  //   const sheetData = filteredNews.map((news, index) => [
  //     index + 1,
  //     turkishToAscii(news.title),
  //     turkishToAscii(news.excerpt),
  //     formatDateTime(news.published_at),
  //     news.sentiment,
  //     news.source,
  //   ]);

  //   const ws = XLSX.utils.aoa_to_sheet([
  //     ["#", "Title", "Excerpt", "Date", "Sentiment", "Source"],
  //     ...sheetData,
  //   ]);
  //   ws["!cols"] = [
  //     { width: 5 },
  //     { width: 50 },
  //     { width: 80 },
  //     { width: 20 },
  //     { width: 10 },
  //     { width: 20 },
  //   ];
  //   ws["!rows"] = [{ hpx: 30 }];
  //   XLSX.utils.book_append_sheet(workbook, ws, "News");
  //   XLSX.writeFile(workbook, "News.xlsx");
  // };
  //////////////////////
  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ span: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  useEffect(() => {
    refetchArticles();
    refetchSource();
  }, [selectedDates, refetchArticles, refetchSource]);
  const handleSourceClick = (clickedSource) => {
    let filteredBySource = [];

    if (articlesData && articlesData.length > 0) {
      filteredBySource = articlesData.filter(
        (news) => news.source === clickedSource
      );
    } else if (selectInterval && selectInterval.length > 0) {
      filteredBySource = selectInterval.filter(
        (news) => news.source === clickedSource
      );
    }
    setFilteredNews(filteredBySource);
    setValue(0);
  };
  // function turkishToAscii(text) {
  //   const charMap = {
  //     ş: "s",
  //     Ş: "S",
  //     ı: "i",
  //     İ: "I",
  //     ğ: "g",
  //     Ğ: "G",
  //     ə: "e",
  //     Ə: "E",
  //   };
  //   return text.replace(/[şŞıİğĞəƏ]/g, function (match) {
  //     return charMap[match];
  //   });
  // }

  // const generatePDF = () => {
  //   const doc = new jsPDF();

  //   doc.text("News", 20, 20);

  //   let yPos = 40;

  //   const tableData = [];
  //   filteredNews.forEach((news, index) => {
  //     tableData.push([
  //       index + 1,
  //       turkishToAscii(news.title),
  //       turkishToAscii(news.excerpt),
  //       formatDateTime(news.published_at),
  //       news.sentiment,
  //       news.source,
  //     ]);
  //   });

  //   const tableHeaders = [
  //     "#",
  //     "Title",
  //     "Excerpt",
  //     "Date",
  //     "Sentiment",
  //     "Source",
  //   ];

  //   doc.autoTable({
  //     head: [tableHeaders],
  //     body: tableData,
  //     startY: yPos,
  //     theme: "grid",
  //     styles: {
  //       fontSize: 10,
  //     },
  //     columnStyles: {
  //       1: { cellWidth: 40 },
  //       2: { cellWidth: 70 },
  //       3: { cellWidth: 20 },
  //       4: { cellWidth: 23 },
  //       5: { cellWidth: 20 },
  //     },
  //   });

  //   doc.save("News.pdf");
  // };

  const selectInterval = location.state && location.state.dataInterval;
  const keyword = location.state && location.state.keyword;
  const getSourceForInterval =
    location.state && location.state.dataIntervalSource;
  let sourceDataLength = 0;
  let sourceForIntervalLength = 0;
  if (sourceData) {
    sourceDataLength = Object.keys(sourceData).length;
  }
  if (getSourceForInterval) {
    sourceForIntervalLength = Object.keys(getSourceForInterval).length;
  }
  const allResults =
    (articlesData && articlesData.length) ||
    (selectInterval && selectInterval.length);

  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedSentiment, setSelectedSentiment] = useState("all");
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

    const formattedDateTime = new Date(dateTime).toLocaleString(
      "en-US",
      options
    );
    return formattedDateTime.replace(",", "");
  };
  useEffect(() => {
    let resultPropsFromLocation = articlesData || [];
    if (selectInterval && selectInterval.length > 0) {
      resultPropsFromLocation = selectInterval;
    }
    if (resultPropsFromLocation && resultPropsFromLocation.length > 0) {
      if (selectedSentiment === "all") {
        setFilteredNews(resultPropsFromLocation);
      } else {
        const filtered = resultPropsFromLocation.filter(
          (news) => news.sentiment.toLowerCase() === selectedSentiment
        );
        setFilteredNews(filtered);
      }
    } else {
      setFilteredNews([]);
    }
  }, [articlesData, selectInterval, selectedSentiment]);
  const handleFilterChange = (sentiment) => {
    setSelectedSentiment(sentiment);
  };
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Fragment>
      <Helmet>
        <title>Medialab | Results</title>
      </Helmet>
      {(articlesData && articlesData.length > 0) || selectInterval ? (
        <Box
          className="flex justify-center items-center"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab sx={{ color: "#adb5bd" }} label="News" {...a11yProps(0)} />
            <Tab
              sx={{ color: "#adb5bd" }}
              label="Statistics"
              {...a11yProps(1)}
            />
            <Tab
              sx={{ color: "#adb5bd" }}
              label="News source"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>
      ) : (
        ""
      )}

      <CustomTabPanel value={value} index={1}>
        <div>
          {(articlesData && articlesData.length > 0) || selectInterval ? (
            <div className=" grid gap-4 my-4 items grid-cols-2 text-white max-md:grid-cols-1">
              <div className="flex flex-col border-[1px] shadow-custom">
                <div className="flex justify-start p-4 border-b max-md:justify-center">
                  <span className="text-[18px] font-bold">Results</span>
                </div>
                <div className="flex justify-center h-full items-center">
                  <span className="text-[54px] font-bold">
                    {allResults && allResults}
                  </span>
                </div>
              </div>
              <div className="flex flex-col border-[1px] shadow-custom">
                <div className="flex justify-start p-4 border-b max-md:justify-center">
                  <span className="text-[18px] font-bold ">UNIQUE AUTHORS</span>
                </div>
                <div className="flex justify-center h-full items-center">
                  <span className="text-[54px] font-bold">
                    {sourceDataLength || sourceForIntervalLength}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {/* <div className="py-8">
            <ApexChart newsCountByDate={newsCountByDate} />
          </div> */}
        </div>
        {/* <div className="">
          <DoughnutChart dataChart={resultProps1 || selectIntervalSentiment} />
        </div> */}
      </CustomTabPanel>

      <CustomTabPanel value={value} index={2}>
        <ErrorBoundary>
          <BubbleChart
            t={sourceData || getSourceForInterval}
            onSourceClick={handleSourceClick}
          />
        </ErrorBoundary>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={0}>
        {(articlesData && articlesData.length > 0) || selectInterval ? (
          <Box
            className="flex justify-center items-center"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tabs
              value={selectedSentiment}
              onChange={(event, newValue) => handleFilterChange(newValue)}
              aria-label="Sentiment tabs"
            >
              <Tab
                label="All"
                sx={{ color: "#adb5bd" }}
                value="all"
                onClick={() => handleFilterChange("all")}
              />
              <Tab
                label="Positive"
                value="positive"
                sx={{ color: "#adb5bd" }}
                onClick={() => handleFilterChange("positive")}
              />
              <Tab
                label="Negative"
                sx={{ color: "#adb5bd" }}
                value="negative"
                onClick={() => handleFilterChange("negative")}
              />
              <Tab
                label="Neutral"
                value="neutral"
                sx={{ color: "#adb5bd" }}
                onClick={() => handleFilterChange("neutral")}
              />
            </Tabs>
          </Box>
        ) : (
          ""
        )}
        <div className=" flex items-center gap-4 max-md:justify-between max-md:mt-4">
          {loadingPdf ? (
            <div className="bg-[#626ed4] gap-2 flex items-center hover:bg-[#535eb4] py-2 my-4 rounded-[8px]  duration-200 text-white max-md:my-0 px-4">
              Loading
              <span className="mx-3 flex items-center">
                <ClipLoader color="#41d3fa" size={18} />
              </span>
            </div>
          ) : (
            <Button
              className="bg-[#626ed4] hover:bg-[#535eb4] px-4  py-2 my-4 rounded-[8px]  duration-200 text-white max-md:my-0  max-md:px-2 max-md:text-[15px]"
              onClick={downloadPdf}
              style={{
                display:
                  filteredNews && filteredNews.length > 0 ? "block" : "none",
              }}
            >
              Convert to pdf
            </Button>
          )}

          {loadingExcel ? (
            <div className="bg-[#626ed4] gap-2 flex items-center hover:bg-[#535eb4]  py-2 my-4 rounded-[8px]  duration-200 text-white max-md:my-0 px-4">
              Loading
              <span className="mx-3 flex items-center">
                <ClipLoader color="#41d3fa" size={18} />
              </span>
            </div>
          ) : (
            <Button
              className="bg-[#626ed4] hover:bg-[#535eb4] px-4 py-2 my-4 rounded-[8px] duration-200 text-white max-md:my-0 max-md:px-2 max-md:text-[15px]"
              onClick={downloadExcel}
              style={{
                display:
                  filteredNews && filteredNews.length > 0 ? "block" : "none",
              }}
            >
              Convert to excel
            </Button>
          )}
        </div>

        {articlesLoading ? (
          <div className="flex flex-col gap-8">
            <div className="skeleton-result h-[240px] rounded-[25px]"></div>
            <div className="skeleton-result h-[240px] rounded-[25px]"></div>
            <div className="skeleton-result h-[240px] rounded-[25px]"></div>
          </div>
        ) : (
          <div>
            {" "}
            {filteredNews && filteredNews.length > 0 ? (
              filteredNews.map((news, index) => (
                <a
                  key={index}
                  rel="noopener noreferrer"
                  href={news && news.link}
                  target="_blank"
                  className="card bg-[#36394c] border-[#6e727d] text-[#b0b6e9] duration-300  my-8 flex  border-[2px] p-4 rounded-[25px] gap-8 max-h-[240px] max-md:max-h-full max-md:flex-col max-md:my-4 max-md:p-2"
                >
                  <div className="max-md:hidden">
                    <div className="h-[200px]  w-[250px] rounded-[12px] ">
                      <img
                        className="w-full h-full object-contain rounded-[12px]"
                        src={
                          news && news.image
                            ? news.image
                            : "../assets/images/logo_white.png"
                        }
                        alt=""
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between gap-1">
                    <span
                      className="text-[24px]  leading-8 line-clamp-2 max-md:text-[18px]"
                      dangerouslySetInnerHTML={{
                        __html:
                          news &&
                          news.title.replace(
                            new RegExp(`(${keyword})`, "gi"),
                            "<strong>$1</strong>"
                          ),
                      }}
                    ></span>
                    <span
                      className="line-clamp-4 text-[#adb5bd]"
                      dangerouslySetInnerHTML={{
                        __html:
                          news &&
                          news.excerpt.replace(
                            new RegExp(`(${keyword})`, "gi"),
                            "<strong>$1</strong>"
                          ),
                      }}
                    ></span>
                    <div className="flex gap-8 text-[#adb5bd] max-md:gap-[0.1rem] max-md:flex-col">
                      <span>{news && formatDateTime(news.published_at)}</span>

                      <span className="line"></span>
                      <span>{news && news.sentiment}</span>
                      {/* <span className="line"></span> */}
                      {/* <span className="max-md:hidden">Azerbaiajan</span> */}
                      <span className="line"></span>
                      <span className="text-[#b0b6e9]">
                        {news && news.source}
                      </span>
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="p-4">
                <span className="font-bold text-[48px] text-white text-center flex justify-center items-center min-h-[50vh]">
                  No search results found
                </span>
              </div>
            )}
          </div>
        )}
      </CustomTabPanel>
    </Fragment>
  );
}

export default ResultKeywords;
