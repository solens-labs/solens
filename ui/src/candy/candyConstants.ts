import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export const Solens_Candy_Machine = new anchor.web3.PublicKey(
  "AYJYSTXnCtuPwyTV5HwQrTsSsUTo2JL4J2DeDmFPMcLD"
);
export const Solens_Candy_Machine2 = new anchor.web3.PublicKey(
  "GQTzsFjz7RbnVL6V8SVgYKE7CYauteRvNAQmHT6H7Ui8"
);

export const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

export const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

export const CandyIDL = {
  "version": "2.0.1",
  "name": "nft_candy_machine_v2",
  "instructions": [
    {
      "name": "mintNft",
      "accounts": [
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "candyMachineCreator",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true,
        },
        {
          "name": "wallet",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "raise",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "mintAuthority",
          "isMut": false,
          "isSigner": true,
        },
        {
          "name": "updateAuthority",
          "isMut": false,
          "isSigner": true,
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "recentBlockhashes",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "instructionSysvarAccount",
          "isMut": false,
          "isSigner": false,
        },
      ],
      "args": [
        {
          "name": "creatorBump",
          "type": "u8",
        },
      ],
    },
    {
      "name": "updateCandyMachine",
      "accounts": [
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
        },
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "raise",
          "isMut": false,
          "isSigner": false,
        },
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "CandyMachineData",
          },
        },
      ],
    },
    {
      "name": "addConfigLines",
      "accounts": [
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
        },
      ],
      "args": [
        {
          "name": "index",
          "type": "u32",
        },
        {
          "name": "configLines",
          "type": {
            "vec": {
              "defined": "ConfigLine",
            },
          },
        },
      ],
    },
    {
      "name": "initializeCandyMachine",
      "accounts": [
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "raise",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "payer",
          "isMut": false,
          "isSigner": true,
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
        },
      ],
      "args": [
        {
          "name": "data",
          "type": {
            "defined": "CandyMachineData",
          },
        },
      ],
    },
    {
      "name": "updateAuthority",
      "accounts": [
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
        },
        {
          "name": "wallet",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "raise",
          "isMut": false,
          "isSigner": false,
        },
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": {
            "option": "publicKey",
          },
        },
      ],
    },
    {
      "name": "withdrawFunds",
      "accounts": [
        {
          "name": "candyMachine",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true,
        },
      ],
      "args": [],
    },
  ],
  "accounts": [
    {
      "name": "CandyMachine",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey",
          },
          {
            "name": "wallet",
            "type": "publicKey",
          },
          {
            "name": "raise",
            "type": "publicKey",
          },
          {
            "name": "share",
            "type": "u64",
          },
          {
            "name": "tokenMint",
            "type": {
              "option": "publicKey",
            },
          },
          {
            "name": "itemsRedeemed",
            "type": "u64",
          },
          {
            "name": "data",
            "type": {
              "defined": "CandyMachineData",
            },
          },
        ],
      },
    },
  ],
  "types": [
    {
      "name": "WhitelistMintSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mode",
            "type": {
              "defined": "WhitelistMintMode",
            },
          },
          {
            "name": "mint",
            "type": "publicKey",
          },
          {
            "name": "presale",
            "type": "bool",
          },
          {
            "name": "discountPrice",
            "type": {
              "option": "u64",
            },
          },
        ],
      },
    },
    {
      "name": "CandyMachineData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "uuid",
            "type": "string",
          },
          {
            "name": "price",
            "type": "u64",
          },
          {
            "name": "symbol",
            "type": "string",
          },
          {
            "name": "sellerFeeBasisPoints",
            "type": "u16",
          },
          {
            "name": "maxSupply",
            "type": "u64",
          },
          {
            "name": "isMutable",
            "type": "bool",
          },
          {
            "name": "retainAuthority",
            "type": "bool",
          },
          {
            "name": "goLiveDate",
            "type": {
              "option": "i64",
            },
          },
          {
            "name": "endSettings",
            "type": {
              "option": {
                "defined": "EndSettings",
              },
            },
          },
          {
            "name": "creators",
            "type": {
              "vec": {
                "defined": "Creator",
              },
            },
          },
          {
            "name": "hiddenSettings",
            "type": {
              "option": {
                "defined": "HiddenSettings",
              },
            },
          },
          {
            "name": "whitelistMintSettings",
            "type": {
              "option": {
                "defined": "WhitelistMintSettings",
              },
            },
          },
          {
            "name": "itemsAvailable",
            "type": "u64",
          },
          {
            "name": "gatekeeper",
            "type": {
              "option": {
                "defined": "GatekeeperConfig",
              },
            },
          },
        ],
      },
    },
    {
      "name": "GatekeeperConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gatekeeperNetwork",
            "type": "publicKey",
          },
          {
            "name": "expireOnUse",
            "type": "bool",
          },
        ],
      },
    },
    {
      "name": "EndSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "endSettingType",
            "type": {
              "defined": "EndSettingType",
            },
          },
          {
            "name": "number",
            "type": "u64",
          },
        ],
      },
    },
    {
      "name": "HiddenSettings",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string",
          },
          {
            "name": "uri",
            "type": "string",
          },
          {
            "name": "hash",
            "type": {
              "array": ["u8", 32],
            },
          },
        ],
      },
    },
    {
      "name": "ConfigLine",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string",
          },
          {
            "name": "uri",
            "type": "string",
          },
        ],
      },
    },
    {
      "name": "Creator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "publicKey",
          },
          {
            "name": "verified",
            "type": "bool",
          },
          {
            "name": "share",
            "type": "u8",
          },
        ],
      },
    },
    {
      "name": "WhitelistMintMode",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "BurnEveryTime",
          },
          {
            "name": "NeverBurn",
          },
        ],
      },
    },
    {
      "name": "EndSettingType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Date",
          },
          {
            "name": "Amount",
          },
        ],
      },
    },
  ],
  "errors": [
    {
      "code": 6000,
      "name": "IncorrectOwner",
      "msg": "Account does not have correct owner!",
    },
    {
      "code": 6001,
      "name": "Uninitialized",
      "msg": "Account is not initialized!",
    },
    {
      "code": 6002,
      "name": "MintMismatch",
      "msg": "Mint Mismatch!",
    },
    {
      "code": 6003,
      "name": "IndexGreaterThanLength",
      "msg": "Index greater than length!",
    },
    {
      "code": 6004,
      "name": "NumericalOverflowError",
      "msg": "Numerical overflow error!",
    },
    {
      "code": 6005,
      "name": "TooManyCreators",
      "msg":
        "Can only provide up to 4 creators to candy machine (because candy machine is one)!",
    },
    {
      "code": 6006,
      "name": "UuidMustBeExactly6Length",
      "msg": "Uuid must be exactly of 6 length",
    },
    {
      "code": 6007,
      "name": "NotEnoughTokens",
      "msg": "Not enough tokens to pay for this minting",
    },
    {
      "code": 6008,
      "name": "NotEnoughSOL",
      "msg": "Not enough SOL to pay for this minting",
    },
    {
      "code": 6009,
      "name": "TokenTransferFailed",
      "msg": "Token transfer failed",
    },
    {
      "code": 6010,
      "name": "CandyMachineEmpty",
      "msg": "Candy machine is empty!",
    },
    {
      "code": 6011,
      "name": "CandyMachineNotLive",
      "msg": "Candy machine is not live!",
    },
    {
      "code": 6012,
      "name": "HiddenSettingsConfigsDoNotHaveConfigLines",
      "msg":
        "Configs that are using hidden uris do not have config lines, they have a single hash representing hashed order",
    },
    {
      "code": 6013,
      "name": "CannotChangeNumberOfLines",
      "msg": "Cannot change number of lines unless is a hidden config",
    },
    {
      "code": 6014,
      "name": "DerivedKeyInvalid",
      "msg": "Derived key invalid",
    },
    {
      "code": 6015,
      "name": "PublicKeyMismatch",
      "msg": "Public key mismatch",
    },
    {
      "code": 6016,
      "name": "NoWhitelistToken",
      "msg": "No whitelist token present",
    },
    {
      "code": 6017,
      "name": "TokenBurnFailed",
      "msg": "Token burn failed",
    },
    {
      "code": 6018,
      "name": "GatewayAppMissing",
      "msg": "Missing gateway app when required",
    },
    {
      "code": 6019,
      "name": "GatewayTokenMissing",
      "msg": "Missing gateway token when required",
    },
    {
      "code": 6020,
      "name": "GatewayTokenExpireTimeInvalid",
      "msg": "Invalid gateway token expire time",
    },
    {
      "code": 6021,
      "name": "NetworkExpireFeatureMissing",
      "msg": "Missing gateway network expire feature when required",
    },
    {
      "code": 6022,
      "name": "CannotFindUsableConfigLine",
      "msg":
        "Unable to find an unused config line near your random number index",
    },
    {
      "code": 6023,
      "name": "InvalidString",
      "msg": "Invalid string",
    },
    {
      "code": 6024,
      "name": "SuspiciousTransaction",
      "msg": "Suspicious transaction detected",
    },
    {
      "code": 6025,
      "name": "CannotSwitchToHiddenSettings",
      "msg":
        "Cannot Switch to Hidden Settings after items available is greater than 0",
    },
  ],
};
