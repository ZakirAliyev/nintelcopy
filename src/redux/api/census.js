import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken, setToken } from "../../components/auth/token/getToken";
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {

  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.originalStatus === 500) {
    window.location.href = "/";
    return result;
  }
  if (result.data && result.data.status === false) {
    const refreshToken = result.data?.message?.refresh_token;
    if (refreshToken) {
      setToken(refreshToken);
      const state = api.getState();
      const promises = [];

      if (state.censusRequest.queries) {
        for (const queryKey in state.censusRequest.queries) {
          const query = state.censusRequest.queries[queryKey];

          if (query?.status === "rejected") {
            promises.push(
              api.dispatch(
                api.endpoints[query.endpointName].initiate(query.originalArgs)
              )
            );
          }
        }
      }
      await Promise.all(promises);
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const censusRequests = createApi({
  reducerPath: "censusRequest",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({ id, dataStart, dataEnd }) =>
        `articles/${id}/${dataStart}/${dataEnd}`,
    }),
    getSentiment: builder.query({
      query: ({ id, dataStart, dataEnd }) =>
        `sentiment/${id}/${dataStart}/${dataEnd}`,
    }),
    getSource: builder.query({
      query: ({ id, dataStart, dataEnd }) =>
        `source-distribution/${id}/${dataStart}/${dataEnd}`,
    }),
  }),
});

export const { useGetSentimentQuery, useGetArticlesQuery, useGetSourceQuery } =
  censusRequests;
