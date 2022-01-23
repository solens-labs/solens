import { getTokenMetadata } from "./getMetadata";

// Get metadata of an array of items
export const fetchItemsMetadata = async (items, totalItems) => {
  const newMints = totalItems.slice(items.length, items.length + 20);
  const newMetadata = newMints.map(async (item, i) => {
    const promise = await getTokenMetadata(item?.mint);
    const tokenMD = await Promise.resolve(promise);
    tokenMD["list_price"] = item?.price;
    tokenMD["list_mp"] = item?.marketplace;
    tokenMD["owner"] = item?.owner;
    return tokenMD;
  });
  const newResolved = await Promise.all(newMetadata);
  const fullItems = [...items, ...newResolved];
  return fullItems;
};
