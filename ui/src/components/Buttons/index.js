import "./style.css";

export const connect_button = (
  <button className="btn-button btn-main btn-large" style={{ width: "80%" }}>
    Connect Wallet
  </button>
);

export const buy_button = (
  <button className="btn-button btn-main btn-large" style={{ width: "40%" }}>
    Buy
  </button>
);

export const sell_button = (
  <button className="btn-button btn-main btn-large" style={{ width: "40%" }}>
    Sell
  </button>
);

export const default_button = (text, link) => {
  return (
    <a href={link} target="_blank" style={{ textDecoration: "none" }}>
      <button className="btn-button btn-main btn-large btn-wide">{text}</button>
    </a>
  );
};
