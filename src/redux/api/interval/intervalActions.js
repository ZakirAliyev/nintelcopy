// src/redux/intervalActions.js
export const SET_INTERVAL = "SET_INTERVAL";

export const setIntervalAction = (interval) => ({
  type: SET_INTERVAL,
  payload: interval,
});
