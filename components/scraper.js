import Web3 from 'web3';
import Config from '../config.js';
import ProcessSwap from './processSwap.js';
import errorHandler from '../errorHandler.js';
import SaveBasePrice from './saveBasePrice.js';
import discordBot from './discordBot.js';
import {LastBlockTime, getTimestamp} from './nodeRequests.js';



const {socket, router, basePair, rpc} = Config();
const web3Socket1 = new Web3(socket);
const web3 = new Web3(rpc);
const Router = web3.eth.abi.encodeParameter('address', router);
const swapEvent = web3.utils.sha3('Swap(address,uint256,uint256,uint256,uint256,address)'); // pancakeswap swap event
const syncEvent = web3.utils.sha3('Sync(uint112,uint112)');
const maxPast = Math.round((Date.now() / 1000) - 86400); // current timestamp - 24 hours


export default function Scraper(data){
    pairs = data;
    startup();
};

let pairs = [],
    sync = {},
    start = true,
    startBlock = 22193937,
    sendError = false,
    promiseSequence = Promise.resolve();


function startup(){
    console.log('Live scraper started')
    const subscription = web3Socket1.eth.subscribe('logs', {
        topics: [
            [swapEvent, syncEvent] // TODO: add Transfer event to track Burn/Mint
        ]
    }).on('data', (logData)=>{
        const {topics, address, logIndex, data, transactionHash, blockNumber} = logData;

        if(start){
            start = false;
            startBlock = blockNumber;
            history();
            console.log('History scraper BSC started')
        };

        
        const exists = pairs.find(({pairAddress}) => pairAddress === address);
        if(exists == undefined) return;

        if(topics[0] == syncEvent){
            const decoded = web3.eth.abi.decodeParameters(['uint112','uint112'], data);
            sync = {
                transactionHash: transactionHash, 
                logIndex: logIndex, 
                reserve0: decoded[0], 
                reserve1: decoded[1]
            };
        } else if(topics[0] == swapEvent){
            if(topics[1] != Router) return;

            if(address === basePair){
                if(sync.logIndex == (logIndex-1)){
                    SaveBasePrice(logData, {reserve0: sync.reserve0, reserve1: sync.reserve1});
                } else {
                    SaveBasePrice(logData);
                };
            };

            if(sync.logIndex == (logIndex-1)){
                ProcessSwap(logData, exists, {reserve0: sync.reserve0, reserve1: sync.reserve1});
            } else {
                ProcessSwap(logData, exists);
            };
        };
    }).on('error', (err)=>{
        subscription.unsubscribe((err, success)=>{
            if(err){
                startup();
                return errorHandler({'file': 'scraper.js', 'function': 'startup', error: err});
            };
        });
        startup();
        return errorHandler({'file': 'scraper.js', 'function': 'startup', error: err});
    });
};

setInterval(async()=>{
    try{
        const blockTime = await LastBlockTime();
        const maxDelay = 60; // if latest block is older then 1 minute
        const currentTime = parseInt((Date.now()/1000).toFixed(0));
        const diff = currentTime - blockTime;

        if(diff > maxDelay || !blockTime){

            if(sendError) return;

            sendError = true;

            discordBot(diff, 'BSC');

            setInterval(()=>{
                sendError = false;
            }, 1800);
        };
    } catch(err){
        errorHandler({'file': 'scraper.js', 'function': 'setInterval', error: err});
    };
}, 30000);


async function history(){
    const currentTime = await getTimestamp(startBlock);
    if(currentTime < maxPast) return;

    web3.eth.getPastLogs({
        fromBlock: startBlock,
        toBlock: startBlock,
        topics: [
            [swapEvent, syncEvent]
        ]
    }).then((logData)=>{
        logData.map((item, i)=>{
            const {address} = item;
            const exists = pairs.find(({pairAddress}) => pairAddress === address);
            if(exists == undefined) return;
            const {topics} = item;
            if(topics[0] == swapEvent){

                if(topics[1] == Router) {

                    const decoded = web3.eth.abi.decodeParameters(['uint112','uint112'], logData[i-1].data);
                    sync = {
                        reserve0: decoded[0], 
                        reserve1: decoded[1]
                    };

                    promiseSequence = [promiseSequence, processHistory(item, sync, exists)];
                };
                
            };
            
            if(i == (logData.length - 1)){
                startBlock = startBlock - 1;
                Promise.all(promiseSequence).then(()=>{
                    
                }).finally(()=>{
                    return history();
                });
            };

        });
    }).catch((err)=>{
        errorHandler({'file': 'scraper-BSC.js', 'function': 'history', error: err});
    });
};


function processHistory(item, sync, pair){
    return new Promise(resolve => {
        ProcessSwap(item, pair, sync, true, ()=>{
            resolve();
        });
    });
};