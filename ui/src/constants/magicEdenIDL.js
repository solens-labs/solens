const magicEdenIDL = {
  version: "0.0.0",
  name: "escrow",
  instructions: [
    {
      name: "placeBid",
      accounts: [
        { name: "bidder", isMut: !0, isSigner: !0 },
        {
          name: "pdaBidderDataAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "pdaBidderDepositAccount", isMut: !0, isSigner: !1 },
        {
          name: "escrowAccount",
          isMut: !1,
          isSigner: !1,
        },
        { name: "systemProgram", isMut: !1, isSigner: !1 },
      ],
      args: [
        { name: "bidAmount", type: "u64" },
        { name: "bump", type: "u8" },
        {
          name: "walletBump",
          type: "u8",
        },
        { name: "expiryDate", type: { option: "i64" } },
      ],
    },
    {
      name: "cancelBid",
      accounts: [
        { name: "bidder", isMut: !0, isSigner: !0 },
        {
          name: "pdaBidderDataAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "pdaBidderDepositAccount", isMut: !0, isSigner: !1 },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
        { name: "systemProgram", isMut: !1, isSigner: !1 },
      ],
      args: [],
    },
    {
      name: "acceptBid",
      accounts: [
        { name: "initializer", isMut: !1, isSigner: !0 },
        {
          name: "bidder",
          isMut: !0,
          isSigner: !1,
        },
        { name: "pdaDepositTokenAccount", isMut: !0, isSigner: !1 },
        {
          name: "pdaBidderDataAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "pdaBidderDepositAccount", isMut: !0, isSigner: !1 },
        {
          name: "escrowAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "pdaAccount", isMut: !1, isSigner: !1 },
        {
          name: "systemProgram",
          isMut: !1,
          isSigner: !1,
        },
        { name: "tokenProgram", isMut: !1, isSigner: !1 },
        {
          name: "platformFeesAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "metadataAccount", isMut: !1, isSigner: !1 },
      ],
      args: [{ name: "expectedBidAmount", type: "u64" }],
    },
    {
      name: "initializeEscrow",
      accounts: [
        { name: "initializer", isMut: !1, isSigner: !0 },
        {
          name: "initializerDepositTokenAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "escrowAccount", isMut: !0, isSigner: !1 },
        { name: "tokenProgram", isMut: !1, isSigner: !1 },
      ],
      args: [{ name: "takerAmount", type: "u64" }],
    },
    {
      name: "initializeEscrow2",
      accounts: [
        { name: "initializer", isMut: !1, isSigner: !0 },
        {
          name: "initializerDepositTokenAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "escrowAccount", isMut: !0, isSigner: !1 },
        {
          name: "tokenProgram",
          isMut: !1,
          isSigner: !1,
        },
        { name: "systemProgram", isMut: !1, isSigner: !1 },
      ],
      args: [
        { name: "takerAmount", type: "u64" },
        { name: "escrowBump", type: "u8" },
      ],
    },
    {
      name: "cancelEscrow",
      accounts: [
        { name: "initializer", isMut: !1, isSigner: !0 },
        {
          name: "pdaDepositTokenAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "pdaAccount", isMut: !1, isSigner: !1 },
        {
          name: "escrowAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "tokenProgram", isMut: !1, isSigner: !1 },
      ],
      args: [],
    },
    {
      name: "exchange2",
      accounts: [
        { name: "taker", isMut: !1, isSigner: !0 },
        {
          name: "pdaDepositTokenAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "initializerMainAccount", isMut: !0, isSigner: !1 },
        {
          name: "escrowAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "pdaAccount", isMut: !1, isSigner: !1 },
        {
          name: "systemProgram",
          isMut: !1,
          isSigner: !1,
        },
        { name: "tokenProgram", isMut: !1, isSigner: !1 },
        {
          name: "platformFeesAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "metadataAccount", isMut: !1, isSigner: !1 },
      ],
      args: [
        { name: "expectedTakerAmount", type: "u64" },
        { name: "expectedMint", type: "publicKey" },
      ],
    },
    {
      name: "exchange",
      accounts: [
        { name: "taker", isMut: !1, isSigner: !0 },
        {
          name: "pdaDepositTokenAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "initializerMainAccount", isMut: !0, isSigner: !1 },
        {
          name: "escrowAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "pdaAccount", isMut: !1, isSigner: !1 },
        {
          name: "systemProgram",
          isMut: !1,
          isSigner: !1,
        },
        { name: "tokenProgram", isMut: !1, isSigner: !1 },
        {
          name: "platformFeesAccount",
          isMut: !0,
          isSigner: !1,
        },
        { name: "metadataAccount", isMut: !1, isSigner: !1 },
      ],
      args: [],
    },
  ],
  accounts: [
    {
      name: "BidAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "bidderKey", type: "publicKey" },
          {
            name: "bidAmount",
            type: "u64",
          },
          { name: "escrowKey", type: "publicKey" },
          { name: "bump", type: "u8" },
          {
            name: "walletBump",
            type: "u8",
          },
          { name: "initializerKey", type: "publicKey" },
          {
            name: "initializerDepositTokenAccount",
            type: "publicKey",
          },
          { name: "expiryDate", type: { option: "i64" } },
        ],
      },
    },
    {
      name: "EscrowAccount",
      type: {
        kind: "struct",
        fields: [
          { name: "initializerKey", type: "publicKey" },
          {
            name: "initializerDepositTokenAccount",
            type: "publicKey",
          },
          { name: "takerAmount", type: "u64" },
        ],
      },
    },
  ],
  errors: [
    {
      code: 300,
      name: "MEPlatformFeesAccountNotOwned",
      msg: "Platform Fees Account not owned by platform",
    },
    {
      code: 301,
      name: "MECreatorListMismatch",
      msg: "Creator fees destination accounts mistmatch with metadata creators list",
    },
    {
      code: 302,
      name: "MECreatorMismatch",
      msg: "Creator fees destination account mistmatch with metadata creator address",
    },
    {
      code: 303,
      name: "MEMetadataAccountIncorrect",
      msg: "Metadata Account is incorrect",
    },
    {
      code: 304,
      name: "MEPDAAccountIncorrect",
      msg: "PDA Account is incorrect",
    },
    {
      code: 305,
      name: "MESellerFeesBasisPointsOverflow",
      msg: "Seller Fees Basis Point Overflow",
    },
    { code: 306, name: "MEPriceOverflow", msg: "Price Invalid" },
    {
      code: 307,
      name: "MECreatorFeesInvalid",
      msg: "Creator Fees Invalid",
    },
    { code: 308, name: "MENotEnoughSOL", msg: "Not enough SOL" },
    {
      code: 309,
      name: "MENumericalOverflow",
      msg: "Numerical Overflow",
    },
    { code: 310, name: "MEExpired", msg: "Expired" },
  ],
};

export default magicEdenIDL;
