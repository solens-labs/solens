import { createSlice, current } from "@reduxjs/toolkit";
// TRADING MASTER SWITCHES

// Initial State
const initialState = {
  tradingEnabled: true,
  tradingME: false,
  tradingSA: true,
};

// Slice
const trade = createSlice({
  name: "trade",
  initialState: initialState,
  reducers: {
    setTradingEnabled: (state, action) => {
      state.tradingEnabled = action.payload;
    },
    setTradingME: (state, action) => {
      state.tradingME = action.payload;
    },
    setTradingSA: (state, action) => {
      state.tradingSA = action.payload;
    },
  },
});

// Actions
export const { setTradingEnabled, setTradingME, setTradingSA } = trade.actions;

// Selectors
export const selectTradingEnabled = (state) => state.trade.tradingEnabled;
export const selectTradingME = (state) => state.trade.tradingME;
export const selectTradingSA = (state) => state.trade.tradingSA;

// Reducer
export default trade.reducer;
