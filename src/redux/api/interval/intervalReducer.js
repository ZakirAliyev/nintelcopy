// src/redux/intervalReducer.js
import { SET_INTERVAL } from "./intervalActions";
const getLast14Days = () => {
  const today = new Date();
  const last14Days = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 13
  );

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  return [formatDate(last14Days), formatDate(today)];
};
const initialState = {
  selectedDates: getLast14Days(),
};

const intervalReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INTERVAL:
      return {
        ...state,
        selectedDates: action.payload,
      };
    default:
      return state;
  }
};

export default intervalReducer;
