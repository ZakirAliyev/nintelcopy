import React, { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import StatsPanel from "../homeComponents/StatsPanel";
import NewsFilter from "../homeComponents/NewsFilter";
import MostSharing from "../homeComponents/MostSharing";
import DailyAnalysis from "../homeComponents/DailyAnalysis";
import {
  useGetArticlesQuery,
  useGetSourceQuery,
  useGetSentimentQuery,
} from "../../redux/api/census";
import { useSelector } from "react-redux";
function Home() {
  const id = useSelector((state) =>state && state.getClicked.selectedKeywordId);
  const selectedDates = useSelector((state) => state.interval.selectedDates);
  const dataStart = selectedDates.length > 0 && selectedDates[0];
  const dataEnd = selectedDates.length > 0 && selectedDates[1];
  const today = new Date();
  const lastMonthStart = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    today.getDate()
  );
  const formattedLastMonth = `${lastMonthStart.getFullYear()}-${(
    lastMonthStart.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${lastMonthStart.getDate().toString().padStart(2, "0")}`;
  const formmattedToday = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
  const { data: articles, isLoading: loadingArticles } = useGetArticlesQuery({
    id,
    dataStart,
    dataEnd,
  });
  const { data: lastMonthData } =
    useGetArticlesQuery({
      id,
      dataStart: formattedLastMonth,
      dataEnd: formmattedToday,
    });
  const { data: source, isLoading: loadingSource } = useGetSourceQuery({
    id,
    dataStart,
    dataEnd,
  });
  const { data: sentiment, isLoading: loadingSentiment } = useGetSentimentQuery(
    {
      id,
      dataStart,
      dataEnd,
    }
  );

  const topNewsSites = [
    "oxu.az",
    "report.az",
    "qafqazinfo.az",
    "qaynarinfo.az",
    "apa.az",
    "trend.az",
    "milli.az",
    "baku.ws",
    "axar.az",
    "azxeber.com",
    "metbuat.az",
    "musavat.com",
    "haqqin.az",
    "moderator.az",
    "news24.az",
  ];
  const [selectedNewsSource, setSelectedNewsSource] = useState("");
  // let accessTokenToSend = tokenCookies;
  // try {
  //   let refresh_token = "";
  //   if (articles && articles.message && articles.message.refresh_token) {
  //     refresh_token = articles.message.refresh_token;
  //   } else if (
  //     sentiment &&
  //     sentiment.message &&
  //     sentiment.message.refresh_token
  //   ) {
  //     refresh_token = sentiment.message.refresh_token;
  //   } else if (source && source.message && source.message.refresh_token) {
  //     refresh_token = source.message.refresh_token;
  //   }
  //   if (refresh_token) {
  //     Cookies.set("token", JSON.stringify(refresh_token));
  //   }
  //   const tokenFromCookie = Cookies.get("token");
  //   const tokenCookies = tokenFromCookie ? JSON.parse(tokenFromCookie) : null;
  //   accessTokenToSend = tokenCookies;
  // } catch (error) {}
  const handleNewsSourceChange = (event) => {
    setSelectedNewsSource(event.target.value);
  };
  useEffect(() => {
    if (articles && articles.length > 0) {
      setSelectedNewsSource(articles && articles[0] && articles[0].source);
    }
  }, [articles]);

  const sentimentFilter = source && source ? Object.keys(source).length : "";

  const getNewsCountByDate = (newsList) => {
    if (!Array.isArray(newsList)) {
      return [];
    }
    const newsCountByDate = {};
    newsList &&
      newsList.forEach((news) => {
        const date = new Date(news.published_at);
        const dayKey = date.toISOString().split("T")[0];
        if (newsCountByDate[dayKey]) {
          newsCountByDate[dayKey]++;
        } else {
          newsCountByDate[dayKey] = 1;
        }
      });

    return newsCountByDate;
  };

  /////// Mənbələrin bu həftəyə nəzərən faizini çıxartmaq/////////

  const getNewsSourceForWeeks = (articlesThisWeek, articlesLastWeek) => {
    let sourcesThisWeek = [];
    let sourcesLastWeek = [];

    articlesThisWeek &&
      articlesThisWeek.forEach((news) => {
        sourcesThisWeek.push(news.source);
      });

    articlesLastWeek &&
      articlesLastWeek.forEach((news) => {
        sourcesLastWeek.push(news.source);
      });
    sourcesThisWeek = [...new Set(sourcesThisWeek)];
    sourcesLastWeek = [...new Set(sourcesLastWeek)];

    return {
      sourcesThisWeekLength: sourcesThisWeek && sourcesThisWeek.length,
      sourcesLastWeekLength: sourcesLastWeek && sourcesLastWeek.length,
    };
  };

  const { sourcesThisWeekLength, sourcesLastWeekLength } =
    getNewsSourceForWeeks(
      articles &&
        articles.filter((news) => {
          const today = new Date();
          const startOfWeek = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - today.getDay()
          );
          const endOfWeek = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + (6 - today.getDay())
          );
          const newsDate = new Date(news.published_at);
          return newsDate >= startOfWeek && newsDate <= endOfWeek;
        }),
      articles &&
        articles.filter((news) => {
          const today = new Date();
          const startOfWeek = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - today.getDay() - 7
          );
          const endOfWeek = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + (6 - today.getDay() - 7)
          );
          const newsDate = new Date(news.published_at);
          return newsDate >= startOfWeek && newsDate <= endOfWeek;
        })
    );
  const getPercentageChangeSources = (lastWeekSources, thisWeekSources) => {
    if (lastWeekSources === 0 && thisWeekSources === 0) {
      return 0;
    } else if (lastWeekSources === 0) {
      return 100;
    } else {
      return ((thisWeekSources - lastWeekSources) / lastWeekSources) * 100;
    }
  };
  const percentageDifference = getPercentageChangeSources(
    sourcesLastWeekLength,
    sourcesThisWeekLength
  );
  ////////////////////////////////////////////////////

  //// Xəbərləri keçən həftəyə nəzərən faizini çixartmaq ////
  // THIS WEEK
  const getThisWeekNewsCount = (newsList) => {
    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay()
    );
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + (6 - today.getDay())
    );

    const thisWeekNews =
      newsList &&
      newsList.filter((news) => {
        const newsDate = new Date(news.published_at);
        return newsDate >= startOfWeek && newsDate <= endOfWeek;
      });
    return thisWeekNews && thisWeekNews.length;
  };
  // LAST WEEK
  const getLastWeekNewsCount = (newsList) => {
    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() - 7
    );
    const endOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + (6 - today.getDay() - 7)
    );

    const lastWeekNews =
      newsList &&
      newsList.filter((news) => {
        const newsDate = new Date(news.published_at);
        return newsDate >= startOfWeek && newsDate <= endOfWeek;
      });
    return lastWeekNews && lastWeekNews.length;
  };

  const getPercentageChange = (lastWeekCount, thisWeekCount) => {
    if (lastWeekCount === 0 && thisWeekCount === 0) {
      return 0;
    } else if (lastWeekCount === 0) {
      return 100;
    } else {
      return ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
    }
  };
  const lastWeekCount = getLastWeekNewsCount(articles);
  const thisWeekCount = getThisWeekNewsCount(articles);
  const percentageChange = getPercentageChange(lastWeekCount, thisWeekCount);
  ///////////////////////////////////////////////////////////////////////////////
  const newsCountByDate = getNewsCountByDate(articles);

  const uniqueNewsSources = Array.from(
    new Set(articles && articles ? articles.map((news) => news.source) : "")
  );

  return (
    <Fragment>
      <Helmet>
        <title>Medialab</title>
      </Helmet>
      <StatsPanel
        articles={articles}
        loading={loadingArticles}
        percentageChange={percentageChange}
        percentageDifference={percentageDifference}
        lastMonthData={lastMonthData}
        sentimentFilter={sentimentFilter}
      />
      <DailyAnalysis
        loading={loadingSentiment}
        sentiment={sentiment}
        newsCountByDate={newsCountByDate}
      />
      <MostSharing source={source} loading={loadingSource} />
      <NewsFilter
        articles={articles}
        loading={loadingArticles}
        selectedNewsSource={selectedNewsSource}
        handleNewsSourceChange={handleNewsSourceChange}
        uniqueNewsSources={uniqueNewsSources}
        topNewsSites={topNewsSites}
      />
    </Fragment>
  );
}

export default Home;
