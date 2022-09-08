import factoryABI from './ABI/factoryABI.js';
import tokenABI from './ABI/tokenABI.js';
import pairABI from './ABI/pairABI.js';
import routerABI from './ABI/routerABI.js';

import * as dotenv from "dotenv";
dotenv.config();

const data = {
    database: process.env.DATABASE,
    getblockKey: process.env.GETBLOCK_KEY,
    rpc: process.env.RPC,
    socket: process.env.SOCKET,
    tokenABI: tokenABI(),
    pairABI: pairABI(),
    factoryABI: factoryABI(),
    routerABI: routerABI(),
    router: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    factory: '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73',
    stableToken: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', // BUSD
    nativeToken: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // WBNB
    basePair: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
};

export default function Config(){
    return data;
};