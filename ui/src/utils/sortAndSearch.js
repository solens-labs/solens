export const sortData = (array, sort) => {
  const needToSort = [...array];
  const sorted = needToSort.sort((a, b) => b[sort] - a[sort]);
  return sorted;
};

export const filterData = (array, term) => {
  const filtered = array.filter((collection) => {
    const filteredTerm = term.toUpperCase();
    const symbol = collection.symbol.toUpperCase();
    const name = collection.name.toUpperCase();

    return name.includes(filteredTerm) || symbol.includes(filteredTerm);
  });

  return filtered;
};
