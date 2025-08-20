import { createSlice } from "@reduxjs/toolkit";
import { getKeywordsResults } from "./resultActions";


export const resultsSlice = createSlice({
    name: "results",
    initialState: {
      resultsData: [],
      isLoading: false,
      isSuccess: false,
      errorMessage: "",
    },
    reducers: {},
    extraReducers: {
      [getKeywordsResults.pending]: (state) => {
        state.isLoading = true;
      },
      [getKeywordsResults.fulfilled]: (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resultsData = payload;
      },
      [getKeywordsResults.rejected]: (state, { payload }) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.errorMessage = payload;
      },
    },
  });
  export default resultsSlice.reducer;