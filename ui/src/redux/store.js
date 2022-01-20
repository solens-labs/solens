import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import appReducer from "./app";

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: customizedMiddleware,
});
