const candyMachine = process.env.REACT_APP_CANDY_MACHINE_ID;

const serverOld = "https://api-mainnet.arnori.io/api/stats/";
const server = "https://api.arnori.io/stats/";
const devServer = "http://3.19.58.245:3000/stats/";

export const queries = {
  symbol: "?symbol=",
  days: "&days=",
  sortVolume: "&sortBy=volume",
  sortCount: "&sortBy=count",
  typeBuyers: "&type=buyers",
  typeSellers: "&type=sellers",
  mintList: "&mint=true",
};

export const api = {
  allCollections: `${server + "allCollections"}`,
  topTrades: `${server + "topTrades"}`,
  topNFTs: `${server + "topNFTs"}`,
  collection: `${server + "collection"}`,
  topTraders: `${server + "topTraders"}`,
  marketStats: `${server + "marketStats"}`,
  floor: `${server + "floor"}`, // need symbol, days

  getAllCollections: `${server + "getAllCollections"}`,
  getCollection: `${server + "getCollection/"}`,
  getDailyStats: `${server + "getDailyStats/"}`,
  getHourlyStats: `${server + "getHourlyStats/"}`,
  getTopBuys: `${server + "getTopBuys/"}`,
  getTopBuyers: `${server + "getTopBuyers/"}`,
  getTopSellers: `${server + "getTopSellers/"}`,
};

export const exchangeApi = {
  magiceden: {
    floor: `https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/`,
  },
  solanart: {
    floor: `https://qzlsklfacc.medianetwork.cloud/get_floor_price?collection=`,
  },
  smb: {
    items: `https://market.solanamonkey.business/api/items`,
  },
};

export const explorerLink = (type, hash) => {
  switch (type) {
    case "tx":
      return `https://solscan.io/tx/${hash}`;
      break;
    case "account":
      return `https://solscan.io/account/${hash}`;
      break;
    case "token":
      return `https://solscan.io/token/${hash}`;
      break;
  }
};

export const teepees = [
  "Eft3BxNdD9gbrXCQfHpafd2bzFWA9L4RdCJZP47JqBwE",
  "EGKjGUsEtCZtPsRSTiPv3FJM9LmPPLt1iUApddYm6XUL",
  "Feh2PMNhYSej92eaFyczH7uuZac4cz3YgiAx8wEv1gLe",
];

export const contractInfo = {
  mainnet: "",
  devnet: candyMachine,
};

export const lineColors = [
  "rgb(134, 64, 117)",
  "rgb(87, 51, 207)",
  "rgb(57, 184, 223)",
  "rgb(255, 255, 255)",
];

export const links = {
  getListed: `https://airtable.com/shrTjju7GiwVTZgtW`,
  email: {
    contact: `mailto: contact@solens.io`,
    admin: `mailto: admin@solens.io`,
  },
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
