import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { getToken } from "../../../components/auth/token/getToken";
export const getKeywordsResults = createAsyncThunk(
  "results,fetchResults",
  async (payload) => {
    const access_token = getToken();
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const dateInterval = Cookies.get("selectedDates");
    const dataPars = JSON.parse(dateInterval);
    const dataStart = dataPars.length > 0 && dataPars[0];
    const dataEnd = dataPars.length > 0 && dataPars[1];
    try {
      const response = await axios.get(
        `${baseUrl}/result-keywords/${payload.keywordId}/${dataStart}/${dataEnd}/${payload.keyword}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(error.message);
    }
  }
);
