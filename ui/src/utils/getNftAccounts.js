// Determine which token accounts are NFTs
const getNftAccounts = (accounts) => {
  const nfts = [];
  for (var key in accounts) {
    const parsedInfo = accounts[key].account.data.parsed.info;
    if (
      parsedInfo.tokenAmount.decimals === 0 &&
      parsedInfo.tokenAmount.amount >= 1
    ) {
      nfts.push(parsedInfo);
    }
  }
  return nfts;
};

export default getNftAccounts;
