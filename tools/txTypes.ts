// SMB Marketplace
// import {Invoke} from "../../solw3/solsea_layout";
import {BN} from '@project-serum/anchor';
import * as anchor from '@project-serum/anchor';
const old_list = '3JWjGGSD5DMUbC8KHym7Qwoun9NUyvd3LKWWzya7cdA2KqMNjkwFhMnaubBft5dfVjBTZfLyjbgvgQdHQrPRTgx5'
const old_cancel = 'ifvkhaqDYp2hQtJ3H6dmV1Dy7h46Bf1RjStamcHia2og57kSzVEBzzRQScHFKTdd9qxgBjujs4L3SQQ5ur2mNxF'
const old_buy = '2LhZJ4z8uXZCCsBcmgiQgrjXPF8BpVEyPKE9jQR5hh3wBUX8yfucs4Bc8M9oUtPoGkCgPzroRixQTPJo6AcDgVCd'

const new_list = '4KAripp3ecA3Dqa7RgVsNKMQQWh3r6zwd2PPhQ6kaXno8xLPzFfDdwLnT9pyhViyWJoxVWgpkrd5vUJZ9Y2kZuxu'
const list_discriminator = '856e4aaf709ff59f' + '01' // last byte

const new_offer = '4NRqScrDY423yuuiikY7LexbmVAveYgsf7HJcBsaz3Ry3UNsCx1fyR32RujPwJkTBUtE3GdfTtBRVgpxdHBkbs8i'
const offer_discriminator = '856e4aaf709ff59f' + '00' // last byte

const cancel = '5XCTLjDRcFHnW7Dx1cKnG7x7DtyhPuS4MfkM2JiiNYsmm5x1LG3BjzzVxY4PPN46xy8MqmdZZNEHuHLwuwyuu57z'
const cancel_discriminator = '5f81edf00831df84'

const exchange = '8p96S5NLbykh5sjZe9pS86zB3YRE41rH6AVbdJWNgGsZxJo5GLz73Fk5f1FJM5oztoB1qYpE9ipRPcVj2SwRiUY'
const exchange_discriminator = '95e23468068ee627'


export class Creator {
    address: anchor.web3.PublicKey;
    verified: boolean;
    share: number;

    constructor(args: {
        address: anchor.web3.PublicKey;
        verified: boolean;
        share: number;
    }) {
        this.address = args.address;
        this.verified = args.verified;
        this.share = args.share;
    }
}

export class ConfigData {
    gateway: string;
    cid: string;
    uuid: string;
    collectionName: string;
    symbol: string;
    sellerFeeBasisPoints: number;
    creators: Creator[];
    maxSupply: BN;
    isMutable: boolean;
    retainAuthority: boolean;
    maxNumberOfLines: number;
    indices: number[];

    constructor(args: {
        gateway: string;
        cid: string;
        uuid: string;
        collectionName: string;
        symbol: string;
        sellerFeeBasisPoints: number;
        creators: Creator[];
        maxSupply: BN;
        isMutable: boolean;
        retainAuthority: boolean;
        maxNumberOfLines: number;
        indices: [number]
    }) {
        this.gateway = args.gateway
        this.cid = args.cid
        this.uuid = args.uuid
        this.collectionName = args.collectionName
        this.symbol = args.symbol
        this.sellerFeeBasisPoints = args.sellerFeeBasisPoints
        this.creators = args.creators
        this.maxSupply = args.maxSupply
        this.isMutable = args.isMutable
        this.retainAuthority = args.retainAuthority
        this.maxNumberOfLines = args.maxNumberOfLines
        this.indices = args.indices
    }
}

export const SCHEMA = new Map<any, any>([
        [
            ConfigData,
            {
                kind: 'struct',
                fields: [
                    {name: 'gateway', type: 'string'},
                    {name: 'cid', type: 'string'},
                    {name: 'uuid', type: 'string'},
                    {name: 'collectionName', type: 'string'},
                    {name: 'symbol', type: 'string'},
                    {name: 'sellerFeeBasisPoints', type: 'u16'},
                    {name: 'creators', type: {vec: {defined: Creator}}},
                    {name: 'maxSupply', type: 'u64'},
                    {name: 'isMutable', type: 'bool'},
                    {name: 'retainAuthority', type: 'bool'},
                    {name: 'maxNumberOfLines', type: 'u16'},
                    {name: 'indices', type: {vec: 'u16'}}
                ]
            },
        ],
        [
            Creator,
            {
                kind: 'struct',
                fields: [
                    ['address', [32]],
                    ['verified', 'bool'],
                    ['share', 'u8'],
                ],
            },
        ],
    ]
)
//
// types: [
//     {
//         name: 'CandyMachineData',
//         type: {
//             kind: 'struct',
//             fields: [
//                 {name: 'uuid', type: 'string'},
//                 {name: 'price', type: 'u64'},
//                 {name: 'itemsAvailable', type: 'u64'},
//                 {name: 'goLiveDate', type: {option: 'i64'}},
//                 {name: 'walletLimit', type: {option: 'u8'}}
//             ]
//         }
//     },
//     {
//         name: 'ConfigData',
//         type: {
//             kind: 'struct',
//             fields: [
//                 {name: 'gateway', type: 'string'},
//                 {name: 'cid', type: 'string'},
//                 {name: 'uuid', type: 'string'},
//                 {name: 'collectionName', type: 'string'},
//                 {name: 'symbol', type: 'string'},
//                 {name: 'sellerFeeBasisPoints', type: 'u16'},
//                 {name: 'creators', type: {vec: {defined: 'Creator'}}},
//                 {name: 'maxSupply', type: 'u64'},
//                 {name: 'isMutable', type: 'bool'},
//                 {name: 'retainAuthority', type: 'bool'},
//                 {name: 'maxNumberOfLines', type: 'u16'},
//                 {name: 'indices', type: {vec: 'u16'}}
//             ]
//         }
//     },
//     {
//         name: 'Creator',
//         type: {
//             kind: 'struct',
//             fields: [
//                 {name: 'address', type: 'publicKey'},
//                 {name: 'verified', type: 'bool'},
//                 {name: 'share', type: 'u8'}
//             ]
//         }
//     }
// ]