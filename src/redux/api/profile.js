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

      if (state.profileRequest.queries) {
        for (const queryKey in state.profileRequest.queries) {
          const query = state.profileRequest.queries[queryKey];
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

export const profileRequest = createApi({
  reducerPath: "profileRequest",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "profile",
    }),
    changePassword: builder.mutation({
      query: (payload) => ({
        url: "change-password",
        method: "PUT",
        body: payload,
      }),
    }),
    profileUpdate: builder.mutation({
      query: (payload) => ({
        url: "profile-update",
        method: "PUT",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useChangePasswordMutation,
  useProfileUpdateMutation,
} = profileRequest;
