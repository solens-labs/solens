import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import appReducer from "./app";
import tradeReducer from "./trade";

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const store = configureStore({
  reducer: {
    app: appReducer,
    trade: tradeReducer,
  },
  middleware: customizedMiddleware,
});
