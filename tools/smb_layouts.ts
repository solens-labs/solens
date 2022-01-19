let idl = {
    version: "0.0.0",
    name: "marketplace",
    instructions: [{
        name: "initializeOrder",
        accounts: [{
            name: "maker",
            isMut: !0,
            isSigner: !0
        }, {
            name: "depositedMintAccount",
            isMut: !1,
            isSigner: !1
        }, {
            name: "expectedMintAccount",
            isMut: !1,
            isSigner: !1
        }, {
            name: "makerDepositTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "makerReceiveTokenAccount",
            isMut: !1,
            isSigner: !1
        }, {
            name: "saleTaxRecipientAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "escrowAccount",
            isMut: !0,
            isSigner: !0
        }, {
            name: "systemProgram",
            isMut: !1,
            isSigner: !1
        }, {name: "tokenProgram", isMut: !1, isSigner: !1}],
        args: [{name: "makerAmount", type: "u64"}, {
            name: "takerAmount",
            type: "u64"
        }, {name: "side", type: {defined: "EscrowType"}}]
    }, {
        name: "cancelOrder",
        accounts: [{
            name: "maker",
            isMut: !0,
            isSigner: !0
        }, {
            name: "makerDepositTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "pdaAccount",
            isMut: !1,
            isSigner: !1
        }, {
            name: "escrowAccount",
            isMut: !0,
            isSigner: !1
        }, {name: "tokenProgram", isMut: !1, isSigner: !1}],
        args: [{name: "bumpSeed", type: "u8"}]
    }, {
        name: "take",
        accounts: [{
            name: "taker",
            isMut: !1,
            isSigner: !0
        }, {
            name: "depositedMintAccount",
            isMut: !1,
            isSigner: !1
        }, {
            name: "expectedMintAccount",
            isMut: !1,
            isSigner: !1
        }, {
            name: "takerDepositTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "takerReceiveTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "makerDepositTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "makerReceiveTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "maker",
            isMut: !0,
            isSigner: !1
        }, {
            name: "saleTaxRecipientAssocTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "escrowAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "pdaAccount",
            isMut: !1,
            isSigner: !1
        }, {
            name: "tokenProgram",
            isMut: !1,
            isSigner: !1
        }, {
            name: "systemProgram",
            isMut: !1,
            isSigner: !1
        }, {name: "metadataAccount", isMut: !1, isSigner: !1}],
        args: [{name: "pdaBump", type: "u8"}, {
            name: "metadataBump",
            type: "u8"
        }]
    }],
    accounts: [{
        name: "EscrowAccount",
        type: {
            kind: "struct",
            fields: [{
                name: "creationTimestamp",
                type: "i64"
            }, {
                name: "makerAccount",
                type: "publicKey"
            }, {
                name: "depositedMintAccount",
                type: "publicKey"
            }, {
                name: "expectedMintAccount",
                type: "publicKey"
            }, {
                name: "makerDepositTokenAccount",
                type: "publicKey"
            }, {
                name: "makerReceiveTokenAccount",
                type: "publicKey"
            }, {name: "makerAmount", type: "u64"}, {
                name: "takerAmount",
                type: "u64"
            }, {name: "taxable", type: "bool"}, {
                name: "side",
                type: {defined: "EscrowType"}
            }]
        }
    }],
    types: [{
        name: "Metadata",
        type: {
            kind: "struct",
            fields: [{
                name: "key",
                type: {defined: "Key"}
            }, {
                name: "updateAuthority",
                type: "publicKey"
            }, {name: "mint", type: "publicKey"}, {
                name: "data",
                type: {defined: "Data"}
            }, {
                name: "primarySaleHappened",
                type: "bool"
            }, {name: "isMutable", type: "bool"}]
        }
    }, {
        name: "Creator",
        type: {
            kind: "struct",
            fields: [{
                name: "address",
                type: "publicKey"
            }, {name: "verified", type: "bool"}, {
                name: "share",
                type: "u8"
            }]
        }
    }, {
        name: "Data",
        type: {
            kind: "struct",
            fields: [{name: "name", type: "string"}, {
                name: "symbol",
                type: "string"
            }, {
                name: "uri",
                type: "string"
            }, {
                name: "sellerFeeBasisPoints",
                type: "u16"
            }, {
                name: "creators",
                type: {option: {vec: {defined: "Creator"}}}
            }]
        }
    }, {
        name: "EscrowType",
        type: {
            kind: "enum",
            variants: [{name: "Offer"}, {name: "Listing"}]
        }
    }, {
        name: "Key",
        type: {
            kind: "enum",
            variants: [{name: "Uninitialized"}, {name: "EditionV1"}, {name: "MasterEditionV1"}, {name: "ReservationListV1"}, {name: "MetadataV1"}, {name: "ReservationListV2"}, {name: "MasterEditionV2"}, {name: "EditionMarker"}]
        }
    }, {
        name: "MetadataError",
        type: {
            kind: "enum",
            variants: [{name: "InvalidMetadata"}, {name: "MissingMetadata"}, {name: "InvalidMetadataKey"}]
        }
    }],
    errors: [{
        code: 300,
        name: "InvalidSideParameter",
        msg: "Invalid side. Should be 0 for Bid and 1 for Ask."
    }, {
        code: 301,
        name: "InvalidBidParameter",
        msg: "Invalid bid (offer) amounts. The taker should be 1 (the NFT), the maker should be above 0."
    }, {
        code: 302,
        name: "InvalidAskParameter",
        msg: "Invalid ask (list) amounts. The maker should be 1 (the NFT), the taker should be above 0."
    }, {
        code: 303,
        name: "CreatorNotFound",
        msg: "Metadata's creators cannot be find in passed accounts"
    }, {
        code: 304,
        name: "TooManyCreatorsAccounts",
        msg: "Maximum number of creators accounts is 5."
    }, {
        code: 305,
        name: "InvalidMetadataAccount",
        msg: "The metadata account passed does not match the mint."
    }, {
        code: 306,
        name: "InvalidDepositAmount",
        msg: "The maker_deposit_token_account doesn't contain the same amount as the maker_amount parameter."
    }, {
        code: 307,
        name: "InvalidTakerAmount",
        msg: "The taker_deposit_token_account doesn't contain the same amount as the escrow_account.taker_amount."
    }, {
        code: 308,
        name: "InvalidDepositMint",
        msg: "The deposited_mint_account/maker_deposit_token_account's mint doesn't match the one from deposited_mint_account."
    }, {
        code: 309,
        name: "InvalidExpectedMint",
        msg: "The expected_mint_account/maker_receive_token_account's mint doesn't match the one from expected_mint_account."
    }, {
        code: 310,
        name: "InvalidSaleTaxRecipient",
        msg: "The SaleTaxeRecipient account passed does not match the hardcoded one in the program."
    }, {
        code: 311,
        name: "InvalidSaleTaxRecipientTokenAccount",
        msg: "The SaleTaxeRecipient Token Account account passed does not match the derived one in the program."
    }, {
        code: 312,
        name: "InvalidSaleTaxRecipientTokenAccountMint",
        msg: "The SaleTaxeRecipient Token Account account passed does not match excepted Mint."
    }, {
        code: 313,
        name: "AmountOverflow",
        msg: "There was an error transfering Flat Fees."
    }, {
        code: 314,
        name: "MakerMismatch",
        msg: "The maker doesn't match the one in the state."
    }, {
        code: 315,
        name: "MakerDepositTokenAccountMismatch",
        msg: "The maker_deposit_token_account doesn't match the one in the state."
    }, {
        code: 316,
        name: "MakerReceiveTokenAccountMismatch",
        msg: "The maker_receive_token_account doesn't match the one in the state."
    }, {
        code: 317,
        name: "NotEnoughLamportForFlatFee",
        msg: "Maker don't have enought money to pay the flat listing fees."
    }]
}


let idl2 = {
    version: "0.0.1",
    name: "marketplace",
    instructions: [{
        name: "initializeOrder",
        accounts: [{
            name: "maker",
            isMut: !0,
            isSigner: !0
        }, {
            name: "makerDepositTokenAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "depositedMintAccount",
            isMut: !1,
            isSigner: !1
        }, {
            name: "escrowAccount",
            isMut: !0,
            isSigner: !0
        }, {
            name: "saleTaxRecipientAccount",
            isMut: !0,
            isSigner: !1
        }, {
            name: "systemProgram",
            isMut: !1,
            isSigner: !1
        }, {
            name: "RentSysvar",
            isMut: !1,
            isSigner: !1
        }, {
            name: "tokenProgram",
            isMut: !1,
            isSigner: !1
        }],
        args: [{name: "makerAmount", type: "u64"}]
    }, {
        name: "cancelOrder",
        accounts: [
            {
                name: "taker",
                isMut: !0,
                isSigner: !0
            }, {
                name: "takerReceiveTokenAccount",
                isMut: !0,
                isSigner: !1
            }, {
                name: "makerDepositTokenAccount",
                isMut: !0,
                isSigner: !1
            }, {
                name: "maker",
                isMut: !0,
                isSigner: !1
            }, {
                name: "escrowAccount",
                isMut: !0,
                isSigner: !1
            }, {
                name: "saleTaxRecipientAccount",
                isMut: !0,
                isSigner: !1
            }, {
                name: "tokenProgram",
                isMut: !1,
                isSigner: !1
            }, {
                name: "systemProgram",
                isMut: !1,
                isSigner: !1
            }
        ],
        args: [{name: "takerAmount", type: "u64"}]
    }]
}