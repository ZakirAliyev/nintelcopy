import { SET_CLICKED_KEYWORD } from "./getClickedActions";
const initialKeywordId = sessionStorage.getItem("keywordId");
const initialState = {
  selectedKeywordId: initialKeywordId ? initialKeywordId : null,
};

const getClickedReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLICKED_KEYWORD:
      return {
        ...state,
        selectedKeywordId: action.payload,
      };
    default:
      return state;
  }
};
export default getClickedReducer;
