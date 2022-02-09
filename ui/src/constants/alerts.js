import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { links, themeColors } from "./constants";
const MySwal = withReactContent(Swal);

const colors = {
  confirmButton: themeColors[0],
  backgroundColor: themeColors[5],
  text: "#fff",
  link: themeColors[0],
};

export const alertNotConnected = () => {
  return MySwal.fire({
    title: (
      <p style={{ color: colors.text, fontSize: "1.5rem" }}>
        Please connect to MetaMask wallet.
      </p>
    ),
    confirmButtonColor: colors.confirmButton,
    background: colors.backgroundColor,
  });
};

export const alertInsufficientBalance = () => {
  return MySwal.fire({
    title: (
      <p style={{ color: colors.text, fontSize: "1.5rem" }}>
        Insufficient balance in your current wallet
      </p>
    ),
    confirmButtonColor: colors.confirmButton,
    background: colors.backgroundColor,
  });
};

export const alertNotWhitelisted = (publicSaleTime) => {
  const saleDate = new Date(publicSaleTime);
  return MySwal.fire({
    title: (
      <p style={{ color: colors.text, fontSize: "1.5rem" }}>
        Your address is not whitelisted for this presale. Connect an address
        with a whitelisted NFT or wait for the public sale to begin on:
        <br />
        <br />
        {saleDate.toLocaleDateString()}
        <br />
        {saleDate.toLocaleTimeString()}
        <br />
        (local timezone)
      </p>
    ),
    confirmButtonColor: colors.confirmButton,
    background: colors.backgroundColor,
  });
};

export const alertLaunchDate = (saleTime) => {
  const saleDate = new Date(saleTime);
  return MySwal.fire({
    title: (
      <p style={{ color: colors.text, fontSize: "1.5rem" }}>
        The playground opens on:
        <br />
        <br />
        {saleDate.toLocaleDateString()}
        <br />
        {saleDate.toLocaleTimeString()}
        <br />
        (local timezone)
      </p>
    ),
    confirmButtonColor: colors.confirmButton,
    background: colors.backgroundColor,
  });
};

export const alertDataError = (contractInfo, testing) => {
  return MySwal.fire({
    title: (
      <p style={{ color: colors.text, fontSize: "1.5rem" }}>
        Data loading, please wait a moment or mint directly from the contract:
        <br />
        <a
          href={
            !testing
              ? `https://etherscan.io/address/${contractInfo.mainnet}`
              : `https://rinkeby.etherscan.io/address/${contractInfo.testnet}`
          }
          style={{
            color: colors.link,
            fontSize: "1.5rem",
            textDecoration: "underline",
          }}
          target="_blank"
        >
          Etherscan
        </a>
      </p>
    ),
    confirmButtonColor: colors.confirmButton,
    background: colors.backgroundColor,
  });
};

export const alertMoreThanZero = () => {
  return MySwal.fire({
    title: (
      <p style={{ color: colors.text, fontSize: "1.5rem" }}>
        Enter a number higher than 0
      </p>
    ),
    confirmButtonColor: colors.confirmButton,
    background: colors.backgroundColor,
  });
};

export const alertSoldOut = () => {
  return MySwal.fire({
    title: (
      <p style={{ color: colors.text, fontSize: "1.5rem" }}>
        The project has sold out!
      </p>
    ),
    confirmButtonColor: colors.confirmButton,
    background: colors.backgroundColor,
  });
};

export const alertMaxPerTx = (max, balance) => {
  return MySwal.fire({
    title: (
      <p style={{ color: colors.text, fontSize: "1.5rem" }}>
        You can only mint {max} per wallet
        <br />
        You currently have {balance}
      </p>
    ),
    confirmButtonColor: colors.confirmButton,
    background: colors.backgroundColor,
  });
};
