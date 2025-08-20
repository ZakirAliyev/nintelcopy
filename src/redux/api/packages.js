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

      if (state.packagesRequests.queries) {
        for (const queryKey in state.packagesRequests.queries) {
          const query = state.packagesRequests.queries[queryKey];
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

export const packagesRequests = createApi({
  reducerPath: "packagesRequests",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getPackages: builder.query({
      query: () => "get-packages",
    }),
    postPackages: builder.mutation({
      query: (payload) => ({
        url: "company-package-add",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});
export const { useGetPackagesQuery, usePostPackagesMutation } =
  packagesRequests;
