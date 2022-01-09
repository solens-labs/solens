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
  collectionName: "",
  sort: "",
  solPrice: 0,
  debug: false,
  showMore: false,
  volumeDay: 0,
  volumeWeek: 0,
  walletBuyers: [],
  walletSellers: [],
  walletBuyersDay: [],
  walletSellersDay: [],
  topNFTsDay: [],
  collectionMints: [],
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
    setCollectionName: (state, action) => {
      state.collectionName = action.payload;
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
    setDailyVolume: (state, action) => {
      state.volumeDay = action.payload;
    },
    setWeeklyVolume: (state, action) => {
      state.volumeWeek = action.payload;
    },
    setWalletBuyers: (state, action) => {
      state.walletBuyers = action.payload;
    },
    setWalletSellers: (state, action) => {
      state.walletSellers = action.payload;
    },
    setWalletBuyersDay: (state, action) => {
      state.walletBuyersDay = action.payload;
    },
    setWalletSellersDay: (state, action) => {
      state.walletSellersDay = action.payload;
    },
    setTopNFTsDay: (state, action) => {
      state.topNFTsDay = action.payload;
    },
    setCollectionMints: (state, action) => {
      state.collectionMints = action.payload;
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
  setCollectionName,
  setSort,
  setSolPrice,
  setDebugMode,
  setShowMore,
  setDailyVolume,
  setWeeklyVolume,
  setWalletBuyers,
  setWalletSellers,
  setWalletBuyersDay,
  setWalletSellersDay,
  setTopNFTsDay,
  setCollectionMints,
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
export const selectCollectionName = (state) => state.app.collectionName;
export const selectSort = (state) => state.app.sort;
export const selectSolPrice = (state) => state.app.solPrice;
export const selectDebugMode = (state) => state.app.debug;
export const selectShowMore = (state) => state.app.showMore;
export const selectDailyVolume = (state) => state.app.volumeDay;
export const selectWeeklyVolume = (state) => state.app.volumeWeek;
export const selectWalletBuyers = (state) => state.app.walletBuyers;
export const selectWalletSellers = (state) => state.app.walletSellers;
export const selectWalletBuyersDay = (state) => state.app.walletBuyersDay;
export const selectWalletSellersDay = (state) => state.app.walletSellersDay;
export const selectTopNFTsDay = (state) => state.app.topNFTsDay;
export const selectCollectionMints = (state) => state.app.collectionMints;

// Reducer
export default app.reducer;
