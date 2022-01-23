import { sortData } from "./sortAndSearch";

export const sortItems = (allItems, sortSelected) => {
  if (sortSelected && allItems.length > 0) {
    let sortType = "";
    let reverse = false;

    switch (sortSelected) {
      case "price_htl":
        sortType = "price";
        break;
      case "price_lth":
        sortType = "price";
        reverse = true;
        break;
      default:
        sortType = "price";
        reverse = true;
    }

    const sorted = sortData(allItems, sortType);
    if (reverse) {
      sorted.reverse();
    }
    return sorted;
  }
};
