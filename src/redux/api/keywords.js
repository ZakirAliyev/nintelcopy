import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken, setToken } from "../../components/auth/token/getToken";
import Cookies from "js-cookie";
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
  let result;

  try {
    result = await baseQuery(args, api, extraOptions);
    if (result.data && result.data.status === false) {
      const refreshToken = result.data?.message?.refresh_token;
      if (refreshToken) {
        setToken(refreshToken);

        const state = api.getState();
        const retryQueries = [];

        if (state.keywordRequests.queries) {
          for (const queryKey in state.keywordRequests.queries) {
            const query = state.keywordRequests.queries[queryKey];
            if (query?.status === "rejected") {
              retryQueries.push(
                api.dispatch(
                  api.endpoints[query.endpointName].initiate(query.originalArgs)
                )
              );
            }
          }
        }
        await Promise.all(retryQueries);
        result = await baseQuery(args, api, extraOptions);
      }
    } else if (result.error && result.error.originalStatus === 429) {
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
    } else if (result.error && result.error.status === 401) {
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
    } else if (result.error && result.error.status === 500) {
      Object.keys(Cookies.get()).forEach((cookieName) => {
        Cookies.remove(cookieName);
      });
    }

    return result;
  } catch (error) {
    console.error(error.message);
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
  }
};

export const keywordRequests = createApi({
  reducerPath: "keywordRequests",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    createTopics: builder.mutation({
      query: (payload) => ({
        url: "create-topic",
        method: "POST",
        body: payload,
      }),
    }),
    editTopics: builder.mutation({
      query: (payload) => ({
        url: `topic/${payload.id}`,
        method: "PUT",
        body: payload,
      }),
    }),
    getUserCompany: builder.query({
      query: () => `get-user-company`,
    }),
    getTopics: builder.query({
      query: () => `get-topics`,
    }),
    getSearch: builder.query({
      query: ({ query }) => `get-search?query=${query}`,
    }),
    deleteTopics: builder.mutation({
      query: ({ id }) => ({
        method: "DELETE",
        url: `delete-topic/${id}`,
      }),
    }),
    getTopicDetail: builder.query({
      query: ({ id }) => `topic-detail/${id}`,
    }),
    getKeywords: builder.query({
      query: ({ id }) => `get-keywords/${id}`,
    }),
    getResultKeywords: builder.query({
      query: ({ id, dataStart, dataEnd, keyword }) =>
        `result-keywords/${id}/${dataStart}/${dataEnd}/${keyword}`,
    }),
  }),
});

export const {
  useCreateTopicsMutation,
  useEditTopicsMutation,
  useGetUserCompanyQuery,
  useGetTopicsQuery,
  useGetSearchQuery,
  useDeleteTopicsMutation,
  useGetTopicDetailQuery,
  useGetKeywordsQuery,
  useGetResultKeywordsQuery,
} = keywordRequests;
