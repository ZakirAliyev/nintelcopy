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
      const retryQueries = [];

      if (state.authRequests.queries) {
        for (const queryKey in state.authRequests.queries) {
          const query = state.authRequests.queries[queryKey];
          if (query?.status === 'rejected') {
            retryQueries.push(api.dispatch(api.endpoints[query.endpointName].initiate(query.originalArgs)));
          }
        }
      }

      await Promise.all(retryQueries);

      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const authRequests = createApi({
  reducerPath: "authRequests",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (payload) => ({
        url: "auth/register",
        method: "POST",
        body: payload,
      }),
    }),
    login: builder.mutation({
      query: (payload) => ({
        url: "auth/login",
        method: "POST",
        body: payload,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "auth/reset-password",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
} = authRequests;
