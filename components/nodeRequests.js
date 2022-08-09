import Web3 from 'web3';
import Config from './config.js';
import errorHandler from '../errorHandler.js';

const {rpc2, factoryABI, pairABI, factory, bitqueryKey} = Config();
const web3RPC2 = new Web3(rpc2);


export async function getDecimals(address){ // get name, symbol, decimals, supply
    try{
        return new Promise(async(resolve, reject)=>{
            const contract = new web3RPC2.eth.Contract(pairABI, address);
            const decimals = await contract.methods.decimals().call().catch(err=>{
                resolve();
                return errorHandler({'file': 'nodeRequests.js', 'function': 'getDecimals', error: err});
            });
            return resolve(decimals);
        });
    } catch(err){
        errorHandler({'file': 'nodeRequests.js', 'function': 'getDecimals', error: err});
    };
};

export async function getName(address){ // get name, symbol, decimals, supply
    return new Promise((resolve, reject)=>{
        try{
            const contract = new web3RPC2.eth.Contract(pairABI, address);
            const name = contract.methods.name().call().catch(err=>{
                resolve();
                return errorHandler({'file': 'nodeRequests.js', 'function': 'getName', error: err});
            });
            return resolve(name);
        } catch(err){
            resolve();
            return errorHandler({'file': 'nodeRequests.js', 'function': 'getName', error: err});
        };
    });
};

export async function getSupply(address){ // get name, symbol, decimals, supply
    return new Promise((resolve, reject)=>{
        try{
            const contract = new web3RPC2.eth.Contract(pairABI, address);
            const supply = contract.methods.totalSupply().call().catch(err=>{
                resolve();
                return errorHandler({'file': 'nodeRequests.js', 'function': 'getSuupply', error: err});
            });
            return resolve(supply);
        } catch(err){
            resolve();
            return errorHandler({'file': 'nodeRequests.js', 'function': 'getSupply', error: err});
        };
    });
};

export async function getSymbol(address){ // get name, symbol, decimals, supply
    return new Promise((resolve, reject)=>{
        try{
            const contract = new web3RPC2.eth.Contract(pairABI, address);
            const symbol = contract.methods.symbol().call().catch(err=>{
                resolve();
                return errorHandler({'file': 'nodeRequests.js', 'function': 'getSymbol', error: err});
            });
            return resolve(symbol);
        } catch(err){
            resolve();
            return errorHandler({'file': 'nodeRequests.js', 'function': 'getSymbol', error: err});
        };
    });
};



/**
 * 
 * @param {blockNumber}
 * @returns timestamp
 * calculating the new timestamp based on 3 seconds per block, using old blockNumber and its timestamp as reference
 */
export async function getTimestamp(blockNumber){ // turn block number into timestamp
    return new Promise((resolve, reject)=>{
        const block = 20206725;
        const blockTime = 1659797577;
        const add = (blockNumber - block) * 3000;
        const newTime = blockTime + add;

        return resolve({timestamp: newTime});

        // web3RPC2.eth.getBlock(blockNumber).then((block)=>{
        //     return resolve({timestamp: block.timestamp});
        // }).catch(err=>{
        //     resolve();
        //     return errorHandler(err);
        // });
    });
};



/**
 * 
 * @param {data} object logData
 * @returns reserves
 */
export function getSync(data){ // sync event contains new reserves of pair, reserver are price/liquidity
    const {blockNumber, logIndex, address} = data;
    const contract = new web3RPC2.eth.Contract(pairABI, address);
    return new Promise(async(resolve, reject)=>{
        contract.getPastEvents('Sync',{
            fromBlock: blockNumber,
            toBlock: blockNumber
        }).then(async(logData)=>{
            if(!logData || logData.length < 1){
                const reserves = await contract.methods.getReserves().call().catch(err=>{
                    resolve();
                    return errorHandler({'file': 'nodeRequests.js', 'function': 'getSync contract reserves', error: err});
                });
                return resolve({reserve0: reserves.returnValues.reserve0, reserve1: reserves.returnValues.reserve1});
            };
            const isSync = (index)=>{ return index.logIndex === (logIndex-1)};
            const getSync = logData.find(isSync);
            return resolve({reserve0: getSync.returnValues.reserve0, reserve1: getSync.returnValues.reserve1});
        }).catch(err=>{
            resolve();
            return errorHandler({'file': 'nodeRequests.js', 'function': 'getSync', error: err});
        });
    });
};



/**
 * 
 * @param {base} contractAddress baseToken
 * @param {quote} contractAddress quoteToken
 * @returns pairAddress - pancakeswap pair address
 */
export function pairAddress(base, quote){ // get pair address from factory contract
    return new Promise((resolve, reject)=>{
        try{
            const factoryContract = new web3RPC2.eth.Contract(factoryABI, factory);
            const pairAddress = factoryContract.methods.getPair(base, quote).call().catch(err=>{
                resolve();
                return errorHandler({'file': 'nodeRequests.js', 'function': 'pairAddress', error: err});
            });
            return resolve(pairAddress);
        } catch(err){
            resolve();
            return errorHandler({'file': 'nodeRequests.js', 'function': 'pairAddress', error: err});
        };
    });
};



/**
 * 
 * @param {address} pairAddress 
 * @returns address - contract address of either baseToken or quoteToken
 */
export function baseToken(address){ // token0 token1 ? from pair contract
    try{
        return new Promise((resolve, reject)=>{
            const pairContract = new web3RPC2.eth.Contract(pairABI, address);
            const token0 = pairContract.methods.token0().call().catch(err=>{
                resolve();
                return errorHandler({'file': 'nodeRequests.js', 'function': 'baseToken', error: err});
            });
            return resolve(token0); // token0 can be base or quote token, from the result we know what it is
        });
    } catch(err){
        resolve();
        return errorHandler({'file': 'nodeRequests.js', 'function': 'baseToken', error: err});
    };
};