const candyMachine = process.env.REACT_APP_CANDY_MACHINE_ID;

// const server = "https://3.144.164.149:3000/api/stats/";
const server = "https://api-mainnet.arnori.io/api/stats/";
const devServer = "http://3.19.58.245:3000/";
export const endpoints = {
  api: {
    getAllCollections: `${server + "getAllCollections"}`,
    getCollection: `${server + "getCollection/"}`,
    getDailyStats: `${server + "getDailyStats/"}`,
    getHourlyStats: `${server + "getHourlyStats/"}`,
    getTopBuys: `${server + "getTopBuys/"}`,
    getTopBuyers: `${server + "getTopBuyers/"}`,
    getTopSellers: `${server + "getTopSellers/"}`,
  },
  dev: {
    allCollections: `${devServer + "allCollections"}`,
    collections: `${devServer + "collections"}`,
    topTrades: `${devServer + "topTrades"}`,
    topTraders: `${devServer + "topTraders"}`,
    topNFTs: `${devServer + "topNFTs"}`,
  },
};

export const contractInfo = {
  mainnet: "",
  devnet: candyMachine,
};

export const lineColors = [
  "rgb(134, 64, 117)",
  "rgb(57, 184, 223)",
  "rgb(87, 51, 207)",
];

export const links = {
  twitter: {
    url: "https://twitter.com/Solens_io",
    text: "Twitter",
  },
  discord: {
    url: "https://discord.gg/",
    text: "Discord",
  },
  opensea: {
    url: "",
    text: "Opensea",
  },
  medium: {
    url: "https://medium.com/@nftblockheadz/560fca36a96",
    text: "Medium",
  },
  contract: {
    url: `https://solscan.io/account/${contractInfo.devnet}`,
    text: "Contract",
  },
  coingecko: {
    solPrice:
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
  },
};
