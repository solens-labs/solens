const candyMachine = process.env.REACT_APP_CANDY_MACHINE_ID;

const server = "https://api.arnori.io/"; // mainnet production
const devServer = "http://18.217.246.3:3000/"; // dev

export const queries = {
  symbol: "?symbol=",
  days: "&days=",
  sortVolume: "&sortBy=volume",
  sortCount: "&sortBy=count",
  typeBuyers: "&type=buyers",
  typeSellers: "&type=sellers",
  mintList: "&mint=true",
  mint: "&mint=",
  allTime: "&all_time=",
};

export const api = {
  server: {
    allCollections: server + "stats/allCollections",
    collection: server + "stats/collection",
    marketStats: server + "stats/marketStats",
    floor: server + "stats/floor",
    topTraders: server + "stats/topTraders",
    topNFTs: server + "stats/topNFTs",
    mintSymbol: server + "symbol?mint=",
    marketVolume: server + "totalMarketVolume",
    currentFloor: server + "currentFloor",
    collectionHistory: server + "recentCollectionActivity?symbol=",

    listings: devServer + "listings",
    mintHistory: devServer + "mintHistory?mint=",
    walletListings: devServer + "walletListings?wallet=",
    walletHistory: devServer + "walletHistory?wallet=",
  },
};

export const exchangeApi = {
  magiceden: {
    floor: `https://api-mainnet.magiceden.io/rpc/getCollectionEscrowStats/`,
    itemDetails: `https://magiceden.io/item-details/`,
  },
  solanart: {
    floor: `https://qzlsklfacc.medianetwork.cloud/get_floor_price?collection=`,
    itemDetails: `https://solanart.io/nft/`,
  },
  smb: {
    items: `https://market.solanamonkey.business/api/items`,
    itemDetails: `https://market.solanamonkey.business/item/`,
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

export const themeColors = [
  "rgb(179, 87, 156)", // Bright Pink
  "rgb(65, 37, 156)", // Gradient Purple
  "rgb(134, 64, 117)", // Gradient Pink
  "rgb(18, 11, 37)", // Dark Purple
  "rgb(57,184,143)", // Teal
  "rgb(25, 16, 51)", // Background Purple
];

export const links = {
  getListed: `https://airtable.com/shrTjju7GiwVTZgtW`,
  launchZone: `https://airtable.com/shrTsUaX9A7M30Qw0`,
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
    url: "https://medium.com/@contact_94841",
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
