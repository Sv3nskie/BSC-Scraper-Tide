import Web3 from 'web3';
import {getSync, getTimestamp} from './nodeRequests.js'
import {saveTX} from '../controllers/txController.js';
import errorHandler from '../errorHandler.js';


const web3 = new Web3();

export default function ProcessSwap(logData, pair, reserve){
    try{
        const {topics, logIndex, blockNumber, transactionHash, data} = logData;
        const {pairAddress, baseDecimals, stable, base0, baseToken} = pair;
        const decoded = web3.eth.abi.decodeParameters(['uint256','uint256','uint256','uint256'], data);
        const sync = reserve ? null : getSync(logData);

        Promise.all([sync, getTimestamp(blockNumber)]).then(d=>{
            const [reserves, timestamp] = d;

            const tx = {
                uniquePoint: transactionHash + '/' + blockNumber + '/' + logIndex,
                tokenAddress: baseToken,
                pairAddress: pairAddress,
                wallet: topics[2],
                txHash: transactionHash,
                txIndex: logIndex,
                block: blockNumber,
                timestamp: timestamp.timestamp,
                reserves0: sync == null ? reserve.reserve0 : reserves.reserve0,
                reserves1: sync == null ? reserve.reserve1 : reserves.reserve1,
                amount0In: decoded[0],
                amount1In: decoded[1],
                amount0Out: decoded[2],
                amount1Out: decoded[3],
                base0: base0,
                baseDecimals: baseDecimals,
                stable: stable,
            };

            saveTX(tx);
            
        }).catch(err=>{
            return errorHandler({'file': 'processSwap.js', 'function': 'ProcessSwap', error: err});
        });
    } catch(err){
        return errorHandler({'file': 'processSwap.js', 'function': 'processSwap', error: err});
    };
};