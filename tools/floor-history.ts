import * as anchor from "@project-serum/anchor"
import {Connection, Keypair, PublicKey} from "@solana/web3.js";
import * as fs from "fs";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {BinaryReader, BinaryWriter, deserializeUnchecked} from 'borsh';
import base58 from 'bs58';

type StringPublicKey = string;

const connection = new Connection('https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/')
const connection1 = new anchor.web3.Connection('https://api.devnet.solana.com');

const metadata = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')
const magicEden = new PublicKey('MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8')

const path = '/Users/sina/.config/solana/90.json'
const keypair = Keypair.fromSecretKey(new Uint8Array(JSON.parse(fs.readFileSync(path).toString())));
const walletWrapper = new anchor.Wallet(keypair);
const provider = new anchor.Provider(connection, walletWrapper, {
    preflightCommitment: 'recent',
});


function getCnadyFilter(candy: string) {
    return {
        dataSlice: {
            offset: 33,
            length: 32
        },
        filters: [
            {
                memcmp: {
                    offset: 326,
                    bytes: candy
                }
            },
            {
                memcmp: {
                    offset: 358,
                    bytes: '2'
                }
            }
        ]
    }

}


export interface configData {
    gateway: string;
    cid: string;
    uuid: string;
    collectionName: string;
    symbol: string;
    sellerFeeBasisPoints: number;
    creators: {
        address: PublicKey;
        verified: boolean;
        share: number;
    }[];
    maxSupply: anchor.BN;
    isMutable: boolean;
    retainAuthority: boolean;
    maxNumberOfLines: number;
    indices: number[];
}

class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            return (this[key] = properties[key]);
        });
    }
}

class Eden extends Assignable {
}

const mschema = new Map<any, any>([
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


function saveMintList(mint_list: any) {
    let mintKeys = new Array<string>(mint_list.length)
    mint_list.forEach((meta, index) => {
        mintKeys[index] = new PublicKey(meta.account.data).toBase58();
    })
    const jsonContent = JSON.stringify(mintKeys)
    fs.writeFileSync('./solgods.json', jsonContent);
    console.log(mint_list.length)
    return
}


async function main() {
    const fetch = require("node-fetch");
    let res = await fetch('https://api-mainnet.arnori.io/stats/collection?symbol=degenape&mint=true')
    let mint = await res.json()
    let mint_list = mint[0].mint.slice(0, 500)
    let before = []
    let before_sig = []
    let last = 0
    let last_sig = null;
    while (true) {
        let d = new Date();
        console.log(d)
        let txs = []
        if (last_sig != null) {
            txs = await connection.getSignaturesForAddress(magicEden, {until: last_sig})
        } else {
            txs = await connection.getSignaturesForAddress(magicEden)
        }
        // let txs1 = await connection.getSignaturesForAddress(magicEden, {before:txs[txs.length-1].signature})
        let sigs = []
        txs.forEach((t) => {
            sigs.push(t.signature)
        })
        // txs1.forEach((t) => {
        //     sigs.push(t.signature)
        // })
        let ptxs = await connection.getParsedConfirmedTransactions(sigs)
        let d2 = new Date()
        console.log(d2)
        console.log(d2.getSeconds() - d.getSeconds())
        // console.log(ptxs.length)
        before.push(ptxs[ptxs.length - 1].blockTime - last)
        last = ptxs[0].blockTime
        last_sig = ptxs[txs.length-1].transaction.signatures[0]
        before_sig.push(last_sig)
        console.log(before)
        if(before[before.length-1] > -90 && before.length > 1){
            last_sig = before_sig[before_sig.length-2]
            before_sig.pop()
        }
    }
    let txs = await connection.getSignaturesForAddress(magicEden)
    let lastsig = txs[txs.length - 1]
    let sigs = []
    txs.forEach((t) => {
        sigs.push(t.signature)
    })
    let d = new Date();
    console.log(d)
    let ptxs = await connection.getParsedConfirmedTransactions(sigs)
    let d2 = new Date()
    console.log(d2)
    console.log(d2.getSeconds() - d.getSeconds())
    console.log(ptxs.length)
    return
    let data = []
    mint_list.forEach((m) => {
        data.push({
            jsonrpc: "2.0",
            id: 1,
            method: "getProgramAccounts",
            params: [
                TOKEN_PROGRAM_ID.toBase58(),
                {
                    encoding: "base64",
                    dataSlice: {
                        offset: 0,
                        length: 0
                    },
                    filters: [
                        {
                            dataSize: 165

                        },
                        {
                            memcmp: {
                                offset: 0,
                                bytes: m.toString()
                            }
                        },
                        {
                            memcmp: {
                                offset: 32,
                                bytes: "GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp"
                            }
                        },
                        {
                            memcmp: {
                                offset: 64,
                                bytes: "Ahg1opVcGX"
                            }
                        },
                    ]
                },
            ],
        })
    })
    console.log(data.length)
    const axios = require('axios')
    let reqqqq = []
    data.forEach((r) => {
        let ffff = axios.post(
            'https://dawn-divine-feather.solana-mainnet.quiknode.pro/971e7d86ae5ad52d9d48097afaec1f7edde191e7/',
            r,
            {
                headers: {"Content-Type": "application/json"},
            }
        )
        reqqqq.push(ffff);
    })
    const tokenAccounts = await axios.all(reqqqq)
    tokenAccounts.forEach((ta) => {
        console.log(ta.data);
    })
    console.log(tokenAccounts.length)
    return
    let ls = await (sigs)
    console.log(ls.length)
    // ls.forEach((l)=>{
    //     console.log(l)
    // })
    return
    // let listed = await connection.getProgramAccounts(magicEden)
    console.log(new Date())
    let txs1 = await connection.getSignaturesForAddress(magicEden, {before: 'opSWhynAR2na1BmY2cGaZ5wemLeK7wh79iNUJecD7R3NmVR3PcwEQrpcKkLnM8YkSvTeh2ujMRnQ1AwjgXJhdzw'})
    console.log(new Date())
    txs1.forEach((t, index) => {
        sigs.push(t.signature)
    })
    console.log(new Date())
    console.log(new Date())
    console.log(ptxs.length)
    return
    // let sups = await connection.(mint_list)
    // console.log(sups);
    return
    // console.log(mint_list)
    let tas = []
    let nfta = []
    for (const m of mint_list) {
        let ttaa = await connection.getTokenLargestAccounts(new PublicKey(m))
        let q = ttaa.value[0].address.toBase58()
        let eeaa = await connection.getProgramAccounts(magicEden, {
            filters: [
                {
                    memcmp: {
                        offset: 40,
                        bytes: q
                    }
                }
            ]
        })
        nfta.push(eeaa)
    }
    console.log(nfta)
    return
    for (const m of mint_list) {
        console.log(m)
        let ta = connection.getProgramAccounts(TOKEN_PROGRAM_ID, {
            dataSlice: {
                offset: 0,
                length: 0
            },
            filters: [
                {
                    dataSize: 165
                },
                {
                    memcmp: {
                        offset: 0,
                        bytes: m
                    }
                },
                {
                    memcmp: {
                        offset: 32,
                        bytes: 'GUfCR9mK6azb9vcpsxgXyj7XRPAKJd4KMHTTVvtncGgp'
                    }
                },
                {
                    memcmp: {
                        offset: 64,
                        bytes: 'Ahg1opVcGX'
                    }
                }

            ]
        });
        console.log(ta)
        tas.push(ta)
    }
    console.log('here')
    let x = await Promise.all(tas)
    console.log(x)
    return
    let eas = []
    for (const ta of tas) {
        let add = ta.pubkey.toBase58()
        let ea = await connection.getProgramAccounts(magicEden, {
            filters: [
                {
                    memcmp: {
                        offset: 40,
                        bytes: add
                    }
                }
            ]
        })
        eas.push(ea)
    }

    eas.forEach((ea) => {
        let esc = deserializeUnchecked(mschema, Eden, ea.data)
        console.log(esc)
    })

    return

    const idl1 = await anchor.Program.fetchIdl('CMY8R8yghKfFnHKCWjzrArUpYH4PbJ56aWBr4kCP4DMk', provider)
    const idl = await anchor.Program.fetchIdl('gdrpGjVffourzkdDRrQmySw4aTHr8a3xmQzzxSwFD1a', provider)
    // const idl = await anchor.Program.fetchIdl('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ', provider)
    // const program = new anchor.Program(idl, 'J7RagMKwSD5zJSbRQZU56ypHUtux8LRDkUpAPSKH4WPp', provider);
    let conf = new PublicKey("D5SgDb9jFdtFs4kW5TSeiRFcWgcNs1dUXBcBNUeFeLCL")
    let wall1 = new PublicKey('8h43uJrRiisY8xs24B2rwsjH38crrCUPdYjY7GCudgEL')
    let wall = new PublicKey('GPTjhvaE7VHPxapiPchhwHdP8vzrZyKpkxxioXJw26gy')
    // let pa = await anchor.web3.PublicKey.findProgramAddress([Buffer.from("candy_machine"), conf.toBuffer(), Buffer.from("wallet_limit")], new PublicKey('CMY8R8yghKfFnHKCWjzrArUpYH4PbJ56aWBr4kCP4DMk'))
    // console.log(pa[0].toBase58())
    // return
    // console.log('here')
    // console.log(idl)
    // return
    idl.instructions.forEach((ix) => {
        console.log(ix)
    })
    console.log()
    idl.accounts.forEach((ix) => {
        console.log(ix.name)
        console.log(ix.type)
    })
    return
    console.log('kk')
    const c1 = {
        address: new PublicKey("7kqAZuuT4krqv9EUmS4ZUv8QsLkSfxxoaHsiSA3XS9kx"),
        share: 100,
        verified: false
    }
    console.log('kk')

    const configD = {
        cid: "bafybeifn3hfnjxx45s4qbzl4ujujerm4bsjpewobnt4l7ht5g5jepwvvue",
        collectionName: "Festive Oblivia",
        creators: [c1],
        gateway: "ipfs.dweb.link",
        indices: [1],
        isMutable: false,
        maxNumberOfLines: 1,
        maxSupply: new anchor.BN(1),
        retainAuthority: false,
        sellerFeeBasisPoints: 100,
        symbol: "FOBLIVIA",
        uuid: "8rzQ5J"
    }


    // const res = await program.rpc.initializeConfig(configD, {
    //     accounts: {
    //         config: new PublicKey('8rzQ5JjQnXPgYkcZXrbsTQCwzn4wXYjYp8kimKYR7Mpp'),
    //         authority: new PublicKey('HaDFrbkq1E2yYb8vLuvLNk44j8PHCgEvqX272w6Ter2M'),
    //         payer: keypair.publicKey,
    //         rent: SYSVAR_RENT_PUBKEY
    //     },
    //     signers: [keypair]
    // })
    // console.log(res)
    // program.idl.instructions.forEach((ix)=>{
    //     console.log(ix)
    //     // console.log(ix.name)
    //     // ix.accounts.forEach((acc)=>{
    //     //     console.log(acc)
    //     // })
    //     // console.log()
    //     // ix.args.forEach((arg)=>{
    //     //     console.log(arg)
    //     // })
    //     console.log()
    // })


    // console.log(util.inspect(idl, false, null, true))
    // program.idl.types.forEach((t)=>{
    //     console.log(t)
    //     // console.log(t.name)
    //     // if (t.type.kind === "struct") {
    //     //     t.type.fields.forEach((f)=>{
    //     //         console.log(f)
    //     //     })
    //     // }
    //     console.log()
    // })
    return

    // const authority = '9uBX3ASjxWvNBAD1xjbVaKA74mWGZys3RGSF7DdeDD3F'
    const candy = 'ALNcW6QDNf7H4iNiTM3FD16LZ4zMGyEeCYQiE1AbCoXk'
    const filter = getCnadyFilter(candy)
    // const mint_list = await connection.getProgramAccounts(metadata, filter)
    // saveMintList(mint_list)
    return

    // const parsedTx = await connection.getParsedConfirmedTransactions(['YEPqFruVMJBoM9TytPiytdEv4d7rNsiYDKkmC12wqZguJKuvXg1qMQBABwBfwHsdjptMCx3fS6Y8u3Q1MGU9eC3'])
    // connection.getSignaturesForAddress()
    // console.log(parsedTx[0].transaction.message.instructions[1]);
    // const mintList = JSON.parse(fs.readFileSync('./smb.json').toString())


    return
}


console.log('Running client.');
main().then(() => console.log('Success'));


/*

-
- get last tx for every nft in the collection and sort them based on slot (descendingly) = S_tx
- it's either a list or a non-list ---> every sell is definitely removed by some tx later or within same tx (for ME)
- build the set of the ones listed, fetch price which is floor atm.
- if the first element in S-tx is a list, remove it and find the previous tx a TA with same mint got listed/removed -->
                                                             ***   unless it was floor, floor doesn't change
                                                             ***   else find next_min among listed
- else if the first element is a non-list then get the listing price and compare with floor then update floor accordingly

- save (floor, mint, token, date) each time floor is updated
- continue until null


 */