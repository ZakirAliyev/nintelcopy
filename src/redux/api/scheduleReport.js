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

  if (result.data && result.data.status === false) {
    const refreshToken = result.data?.message?.refresh_token;
    if (refreshToken) {
      setToken(refreshToken);
      const state = api.getState();
      const promises = [];

      if (state.scheduleRequest.queries) {
        for (const queryKey in state.scheduleRequest.queries) {
          const query = state.scheduleRequest.queries[queryKey];
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

export const scheduleRequest = createApi({
  reducerPath: "scheduleRequest",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getSchedule: builder.query({
      query: ({ id }) => `get-schedule-report/${id}`,
    }),
    getTelegramReport: builder.query({
      query: ({ id }) => `get-telegram-report/${id}`,
    }),
    postSchedule: builder.mutation({
      query: (payload) => ({
        url: "schedule-report",
        method: "POST",
        body: payload,
      }),
    }),
    postTelegramReport: builder.mutation({
      query: (payload) => ({
        url: "telegram-report",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetScheduleQuery,
  useGetTelegramQuery,
  usePostScheduleMutation,
  usePostTelegramMutation,
} = scheduleRequest;
