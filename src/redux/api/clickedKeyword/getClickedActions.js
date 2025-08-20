export const SET_CLICKED_KEYWORD = "SET_SELECTED_KEYWORD";

export const setClickedKeyword = (keywordId) => ({
  type: SET_CLICKED_KEYWORD,
  payload: keywordId,
});