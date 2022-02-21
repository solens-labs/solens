import {BinaryReader, BinaryWriter} from "borsh";
import {PublicKey} from "@solana/web3.js";

type StringPublicKey = string;
import base58 from 'bs58';


export const MEdenIdl = {
    version: "0.0.0",
    name: "escrow",
    instructions: [{
        name: "placeBid",
        accounts: [{name: "bidder", isMut: !0, isSigner: !0}, {
            name: "pdaBidderDataAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "pdaBidderDepositAccount", isMut: !0, isSigner: !1}, {
            name: "escrowAccount",
            isMut: !1,
            isSigner: !1
        }, {name: "systemProgram", isMut: !1, isSigner: !1}],
        args: [{name: "bidAmount", type: "u64"}, {name: "bump", type: "u8"}, {
            name: "walletBump",
            type: "u8"
        }, {name: "expiryDate", type: {option: "i64"}}]
    }, {
        name: "cancelBid",
        accounts: [{name: "bidder", isMut: !0, isSigner: !0}, {
            name: "pdaBidderDataAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "pdaBidderDepositAccount", isMut: !0, isSigner: !1}, {
            name: "tokenProgram",
            isMut: !1,
            isSigner: !1
        }, {name: "systemProgram", isMut: !1, isSigner: !1}],
        args: []
    }, {
        name: "acceptBid",
        accounts: [{name: "initializer", isMut: !1, isSigner: !0}, {
            name: "bidder",
            isMut: !0,
            isSigner: !1
        }, {name: "pdaDepositTokenAccount", isMut: !0, isSigner: !1}, {
            name: "pdaBidderDataAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "pdaBidderDepositAccount", isMut: !0, isSigner: !1}, {
            name: "escrowAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "pdaAccount", isMut: !1, isSigner: !1}, {
            name: "systemProgram",
            isMut: !1,
            isSigner: !1
        }, {name: "tokenProgram", isMut: !1, isSigner: !1}, {
            name: "platformFeesAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "metadataAccount", isMut: !1, isSigner: !1}],
        args: [{name: "expectedBidAmount", type: "u64"}]
    }, {
        name: "initializeEscrow",
        accounts: [{name: "initializer", isMut: !1, isSigner: !0}, {
            name: "initializerDepositTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "escrowAccount", isMut: !0, isSigner: !1}, {name: "tokenProgram", isMut: !1, isSigner: !1}],
        args: [{name: "takerAmount", type: "u64"}]
    }, {
        name: "initializeEscrow2",
        accounts: [{name: "initializer", isMut: !1, isSigner: !0}, {
            name: "initializerDepositTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "escrowAccount", isMut: !0, isSigner: !1}, {
            name: "tokenProgram",
            isMut: !1,
            isSigner: !1
        }, {name: "systemProgram", isMut: !1, isSigner: !1}],
        args: [{name: "takerAmount", type: "u64"}, {name: "escrowBump", type: "u8"}]
    }, {
        name: "cancelEscrow",
        accounts: [{name: "initializer", isMut: !1, isSigner: !0}, {
            name: "pdaDepositTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "pdaAccount", isMut: !1, isSigner: !1}, {
            name: "escrowAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "tokenProgram", isMut: !1, isSigner: !1}],
        args: []
    }, {
        name: "exchange2",
        accounts: [{name: "taker", isMut: !1, isSigner: !0}, {
            name: "pdaDepositTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "initializerMainAccount", isMut: !0, isSigner: !1}, {
            name: "escrowAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "pdaAccount", isMut: !1, isSigner: !1},
            {name: "tokenProgram", isMut: !1, isSigner: !1},
            {
            name: "systemProgram",
            isMut: !1,
            isSigner: !1
        },
            {
            name: "platformFeesAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "metadataAccount", isMut: !1, isSigner: !1}],
        args: [{name: "expectedTakerAmount", type: "u64"}, {name: "expectedMint", type: "publicKey"}]
    }, {
        name: "exchange",
        accounts: [{name: "taker", isMut: !1, isSigner: !0}, {
            name: "pdaDepositTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "initializerMainAccount", isMut: !0, isSigner: !1}, {
            name: "escrowAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "pdaAccount", isMut: !1, isSigner: !1}, {
            name: "systemProgram",
            isMut: !1,
            isSigner: !1
        }, {name: "tokenProgram", isMut: !1, isSigner: !1}, {
            name: "platformFeesAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "metadataAccount", isMut: !1, isSigner: !1}],
        args: []
    }],
    accounts: [{
        name: "BidAccount",
        type: {
            kind: "struct",
            fields: [{name: "bidderKey", type: "publicKey"}, {
                name: "bidAmount",
                type: "u64"
            }, {name: "escrowKey", type: "publicKey"}, {name: "bump", type: "u8"}, {
                name: "walletBump",
                type: "u8"
            }, {name: "initializerKey", type: "publicKey"}, {
                name: "initializerDepositTokenAccount",
                type: "publicKey"
            }, {name: "expiryDate", type: {option: "i64"}}]
        }
    }, {
        name: "EscrowAccount",
        type: {
            kind: "struct",
            fields: [{name: "initializerKey", type: "publicKey"}, {
                name: "initializerDepositTokenAccount",
                type: "publicKey"
            }, {name: "takerAmount", type: "u64"}]
        }
    }],
    errors: [{
        code: 300,
        name: "MEPlatformFeesAccountNotOwned",
        msg: "Platform Fees Account not owned by platform"
    }, {
        code: 301,
        name: "MECreatorListMismatch",
        msg: "Creator fees destination accounts mistmatch with metadata creators list"
    }, {
        code: 302,
        name: "MECreatorMismatch",
        msg: "Creator fees destination account mistmatch with metadata creator address"
    }, {code: 303, name: "MEMetadataAccountIncorrect", msg: "Metadata Account is incorrect"}, {
        code: 304,
        name: "MEPDAAccountIncorrect",
        msg: "PDA Account is incorrect"
    }, {
        code: 305,
        name: "MESellerFeesBasisPointsOverflow",
        msg: "Seller Fees Basis Point Overflow"
    }, {code: 306, name: "MEPriceOverflow", msg: "Price Invalid"}, {
        code: 307,
        name: "MECreatorFeesInvalid",
        msg: "Creator Fees Invalid"
    }, {code: 308, name: "MENotEnoughSOL", msg: "Not enough SOL"}, {
        code: 309,
        name: "MENumericalOverflow",
        msg: "Numerical Overflow"
    }, {code: 310, name: "MEExpired", msg: "Expired"}]
}


export const MEv2Idl = {
    version: "0.1.0",
    name: "auction_house",
    instructions: [{
        name: "sell",
        accounts: [{name: "seller", isMut: !0, isSigner: !0}, {
            name: "treasuryMint",
            isMut: !0,
            isSigner: !1
        }, {name: "sellerTokenAccount", isMut: !0, isSigner: !1}, {
            name: "sellerAta",
            isMut: !0,
            isSigner: !1
        },
            {
                name: "tokenMint",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "mintMetadata",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "auctionCreator",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "auctionHouse",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "sellerTradeState",
                isMut: !0,
                isSigner: !1
            },
            {
                name: "authority",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "tokenProgram",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "systemProgram",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "associatedTokenAccountProgram",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "programAsSigner",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "rent",
                isMut: !1,
                isSigner: !1
            },

        ],
        args: [{name: "bump", type: "u8"}, {name: "auctionBump", type: "u8"}, {
            name: "sellerPrice",
            type: "u64"
        }, {name: "tokenAmount", type: "u64"}, {name: "extra", type: "u64"}]
    }, {
        name: "buy",
        accounts: [{name: "buyer", isMut: !0, isSigner: !0}, {
            name: "treasuryMint",
            isMut: !1,
            isSigner: !1
        }, {name: "mint", isMut: !1, isSigner: !1}, {
            name: "mintMetadata",
            isMut: !1,
            isSigner: !1
        },
            {
                name: "buyerEscrow",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "auctionCreator",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "auctionHouse",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "buyerTradeState",
                isMut: !0,
                isSigner: !1
            },
            {
                name: "authority",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "tokenProgram",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "systemProgram",
                isMut: !1,
                isSigner: !1
            },
            {
                name: "rent",
                isMut: !1,
                isSigner: !1
            },

        ],
        args: [
            {
                name: "bump", type: "u8"
            },
            {
                name: "escrowBump", type: "u8"
            },
            {
                name: "buyerPrice", type: "u64"
            },
            {
                name: "tokenAmount", type: "u64"
            },
            {
                name: "extra", type: "u64"
            },
        ]
    }, {
        name: "deposit",
        accounts: [{name: "user", isMut: !1, isSigner: !0}, {
            name: "treasuryMint",
            isMut: !1,
            isSigner: !1
        }, {name: "userEscrow", isMut: !0, isSigner: !1}, {
            name: "auctionCreator",
            isMut: !1,
            isSigner: !1
        }, {name: "auctionHouse", isMut: !1, isSigner: !1}, {
            name: "systemProgram",
            isMut: !1,
            isSigner: !1
        }],
        args: [
            {name: "bump", type: "u8"},
            {name: "amount", type: "u64"},
        ]
    }, {
        name: "withdraw",
        accounts: [{name: "user", isMut: !1, isSigner: !0}, {
            name: "treasuryMint",
            isMut: !1,
            isSigner: !1
        }, {name: "userEscrow", isMut: !0, isSigner: !1},
            {name: "auctionCreator", isMut: !1, isSigner: !1},
            {name: "auctionHouse", isMut: !1, isSigner: !1},
            {name: "systemProgram", isMut: !1, isSigner: !1},
        ],
        args: [
            {name: "bump", type: "u8"},
            {name: "amount", type: "u64"},
        ]
    }, {
        name: "cancelSell",
        accounts: [{name: "seller", isMut: !1, isSigner: !0}, {
            name: "treasuryMint",
            isMut: !1,
            isSigner: !1
        }, {name: "sellerATA", isMut: !0, isSigner: !1}, {
            name: "mint",
            isMut: !1,
            isSigner: !1
        },
            {name: "auctionCreator", isMut: !1, isSigner: !1},
            {name: "auctionHouse", isMut: !1, isSigner: !1},
            {name: "sellerTradeState", isMut: !0, isSigner: !1},
            {name: "authority", isMut: !1, isSigner: !1},
            {name: "tokenProgram", isMut: !1, isSigner: !1},
            {
                name: "programAsSigner",
                isMut: !1,
                isSigner: !1
            },
        ],
        args: [{name: "sellerPrice", type: "u64"}, {name: "tokenAmount", type: "u64"}, {name: "extra", type: "u64"}]
    }, {
        name: "cancelBuy",
        accounts: [{name: "buyer", isMut: !1, isSigner: !0}, {
            name: "treasuryMint",
            isMut: !1,
            isSigner: !1
        }, {name: "mint", isMut: !0, isSigner: !1}, {
            name: "auctionCreator",
            isMut: !1,
            isSigner: !1
        },
            {name: "auctionHouse", isMut: !1, isSigner: !1},
            {name: "buyerTradeState", isMut: !0, isSigner: !1},
            {name: "authority", isMut: !1, isSigner: !1},

        ],
        args: [{name: "buyerPrice", type: "u64"}, {name: "tokenAmount", type: "u64"}, {name: "extra", type: "u64"}]
    }, {
        name: "executeSale",
        accounts: [{name: "buyer", isMut: !0, isSigner: !1}, {
            name: "seller",
            isMut: !0,
            isSigner: !1
        },
            {name: "treasuryMint", isMut: !1, isSigner: !1},
            {name: "sellerATA", isMut: !0, isSigner: !1},
            {name: "tokenMint", isMut: !1, isSigner: !1},
            {name: "mintMetadata", isMut: !1, isSigner: !1},
            {name: "buyerEscrow", isMut: !0, isSigner: !1},
            {name: "buyerATA", isMut: !0, isSigner: !1},
            {name: "auctionCreator", isMut: !0, isSigner: !1},
            {name: "auctionHouse", isMut: !1, isSigner: !1},
            {name: "auctionFee", isMut: !0, isSigner: !1},
            {name: "buyerTradeState", isMut: !0, isSigner: !1},
            {name: "authority", isMut: !0, isSigner: !1},
            {name: "sellerTradeState", isMut: !0, isSigner: !1},
            {name: "eauthority", isMut: !0, isSigner: !1},
            {name: "tokenProgram", isMut: !1, isSigner: !1},
            {name: "systemProgram", isMut: !1, isSigner: !1},
            {name: "associatedTokenAccountProgram", isMut: !1, isSigner: !1},
            {name: "programAsSigner", isMut: !1, isSigner: !1},
            {name: "rent", isMut: !1, isSigner: !1},
        ],
        args: [{name: "buyerEscrowBump", type: "u8"}, {name: "auctionBump", type: "u8"},
            {name: "buyerPrice", type: "u64"},
            {name: "tokenAmount", type: "u64"},
            {name: "extraBuyer", type: "u64"},
            {name: "extraSeller", type: "u64"},
        ]
    }]
}


class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            return (this[key] = properties[key]);
        });
    }
}

export class Eden extends Assignable {
}

export const MAGICEDEN_SCHEMA = new Map<any, any>([
    [
        Eden,
        {
            kind: "struct",
            fields: [
                ["discriminator", "u64"],
                ["initializer", "pubkeyAsString"],
                ["tokenAccount", "pubkeyAsString"],
                ["price", "u64"]
            ]
        }
    ]

])


export const extendBorsh = () => {
    (BinaryReader.prototype as any).readPubkey = function () {
        const reader = this as unknown as BinaryReader;
        const array = reader.readFixedArray(32);
        return new PublicKey(array);
    };

    (BinaryWriter.prototype as any).writePubkey = function (value: PublicKey) {
        const writer = this as unknown as BinaryWriter;
        writer.writeFixedArray(value.toBuffer());
    };

    (BinaryReader.prototype as any).readPubkeyAsString = function () {
        const reader = this as unknown as BinaryReader;
        const array = reader.readFixedArray(32);
        return base58.encode(array) as StringPublicKey;
    };

    (BinaryWriter.prototype as any).writePubkeyAsString = function (
        value: StringPublicKey,
    ) {
        const writer = this as unknown as BinaryWriter;
        writer.writeFixedArray(base58.decode(value));
    };
};

extendBorsh();