import { createSlice, current } from "@reduxjs/toolkit";

// Initial State
const initialState = {
  address: "",
  balance: 0,
  connected: false,
  loading: false,
  currentPage: "mint",
  colorMode: "light_mode",
  remaining: "Loading...",
  allCollections: [],
  allStats: [],
  collection: undefined,
  sort: "",
  solPrice: 0,
  debug: false,
  showMore: false,
};

// Slice
const app = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setColorMode: (state, action) => {
      state.colorMode = action.payload;
    },
    setRemaining: (state, action) => {
      state.remaining = action.payload;
    },
    setAllCollections: (state, action) => {
      state.allCollections = action.payload;
    },
    setAllStats: (state, action) => {
      state.allStats = action.payload;
    },
    setCollection: (state, action) => {
      state.collection = action.payload;
    },
    setSort: (state, action) => {
      state.sort = action.payload;
    },
    setSolPrice: (state, action) => {
      state.solPrice = action.payload;
    },
    setDebugMode: (state, action) => {
      state.debug = action.payload;
    },
    setShowMore: (state, action) => {
      state.showMore = action.payload;
    },
  },
});

// Actions
export const {
  setAddress,
  setBalance,
  setConnected,
  setLoading,
  setCurrentPage,
  setColorMode,
  setRemaining,
  setAllCollections,
  setAllStats,
  setCollection,
  setSort,
  setSolPrice,
  setDebugMode,
  setShowMore,
} = app.actions;

// Selectors
export const selectAddress = (state) => state.app.address;
export const selectBalance = (state) => state.app.balance;
export const selectConnected = (state) => state.app.connected;
export const selectLoading = (state) => state.app.loading;
export const selectCurrentPage = (state) => state.app.currentPage;
export const selectColorMode = (state) => state.app.colorMode;
export const selectRemaining = (state) => state.app.remaining;
export const selectAllCollections = (state) => state.app.allCollections;
export const selectAllStats = (state) => state.app.allStats;
export const selectCollection = (state) => state.app.collection;
export const selectSort = (state) => state.app.sort;
export const selectSolPrice = (state) => state.app.solPrice;
export const selectDebugMode = (state) => state.app.debug;
export const selectShowMore = (state) => state.app.showMore;

// Reducer
export default app.reducer;
