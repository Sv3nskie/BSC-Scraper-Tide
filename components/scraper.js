import Web3 from 'web3';
import Config from './config.js';
import ProcessSwap from './processSwap.js';
import errorHandler from '../errorHandler.js';
import SaveBasePrice from './saveBasePrice.js';


const {socket1, socket2, router, basePair} = Config();

const web3Socket1 = new Web3(socket1);
const web3 = new Web3();
const Router = web3.eth.abi.encodeParameter('address', router);
const swapEvent = web3.utils.sha3('Swap(address,uint256,uint256,uint256,uint256,address)'); // pancakeswap swap event
const syncEvent = web3.utils.sha3('Sync(uint112,uint112)');

let pairs = [];

export default function Scraper(data){
    pairs = data;
    startup();
};

let sync = {
    // transactionHash
    // logIndex
    // data
};

function startup(){
    const subscription = web3Socket1.eth.subscribe('logs', {
        topics: [
            [swapEvent, syncEvent] // TODO: add Transfer event to track Burn/Mint
        ]
    }).on('data', (logData)=>{
        const {topics, address, logIndex, data, transactionHash} = logData;
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