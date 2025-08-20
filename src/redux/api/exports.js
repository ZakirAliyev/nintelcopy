import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../components/auth/token/getToken";
//EXCEL//
export const exportRequests = createApi({
  reducerPath: "exportRequests",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    },
  }),
  endpoints: (builder) => ({
    getExcel: builder.query({
      query: ({ startData, endData, id }) =>
        `download-excel/${id}/${startData}/${endData}`,
    }),
  }),
});
//PDF//
exportRequests.injectEndpoints({
  endpoints: (builder) => ({
    getPdf: builder.query({
      query: ({ id, startData, endData }) =>
        `download-pdf/${id}/${startData}/${endData}`,
    }),
  }),
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const { useGetExcelQuery, useGetPdfQuery } = exportRequests;
