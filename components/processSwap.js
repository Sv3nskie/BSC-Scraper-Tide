import Web3 from 'web3';
import {getSync, getTimestamp} from './nodeRequests.js'
import {saveTX} from '../controllers/txController.js';
import errorHandler from '../errorHandler.js';


const web3 = new Web3();

export default function ProcessSwap(logData, pair, reserve, history, callback){
    try{
        const {topics, logIndex, blockNumber, transactionHash, data} = logData;
        const {pairAddress, baseDecimals, stable, base0, baseToken} = pair;
        const decoded = web3.eth.abi.decodeParameters(['uint256','uint256','uint256','uint256'], data);
        const wallet = web3.eth.abi.decodeParameter('address', topics[2]);
        const sync = reserve ? null : getSync(logData);

        Promise.all([sync, getTimestamp(blockNumber)]).then(d=>{
            const [reserves, timestamp] = d;
            const in0 = decoded[0] < 1 ? true : false;
            const type = base0 ? (in0 ? 'Buy' : 'Sell') : (in0 ? 'Sell' : 'Buy');

            const res0 = sync == null ? reserve.reserve0 : reserves.reserve0;
            const res1 = sync == null ? reserve.reserve1 : reserves.reserve1;

            const x = (base0 ? res0 / (10 ** baseDecimals) : res0 / (10 ** 18));
            const y = (base0 ? res1 / (10 ** 18) : res1 / (10 ** baseDecimals));
            const p = (base0 ? y / x :  x / y);


            const amountTX = {
                amount0In: base0 ? decoded[0] / (10 ** baseDecimals) : decoded[0] / (10 ** 18),
                amount1In: base0 ? decoded[1] / (10 ** 18) : decoded[1] / (10 ** baseDecimals),
                amount0Out: base0 ? decoded[2] / (10 ** baseDecimals) : decoded[2] / (10 ** 18),
                amount1Out: base0 ? decoded[3] / (10 ** 18) : decoded[3] / (10 ** baseDecimals),
            };

            const {amount0In, amount1In, amount0Out, amount1Out} = amountTX;

            const baseAmount = base0 ? (in0 ? amount0Out : amount0In) : (in0 ? amount1In : amount1Out); 
            const quoteAmount = base0 ? (in0 ? amount1In : amount1Out) : (in0 ? amount0Out : amount0In) ; 

            const conversionRate = (quoteAmount / baseAmount).toString();

            const priceNewCon = new Number (conversionRate).toFixed(18);
            const pricePaidCon = new Number (conversionRate).toFixed(18);

            const tx = {
                uniquePoint: transactionHash + '/' + blockNumber + '/' + logIndex,
                tokenAddress: baseToken,
                pairAddress: pairAddress,
                wallet: wallet,
                txHash: transactionHash,
                txIndex: logIndex,
                block: blockNumber,
                timestamp: timestamp.timestamp,
                reserves0: x,
                reserves1: y,
                amount0In: amount0In,
                amount1In: amount1In,
                amount0Out: amount0Out,
                amount1Out: amount1Out,
                base0: base0,
                baseDecimals: baseDecimals,
                stable: stable,
                type: type,
                baseAmount: baseAmount,
                quoteAmount: quoteAmount,
                conversionRate: conversionRate.includes('e-') ? pricePaidCon : conversionRate,
                newPrice: p.toString().includes('e-') ? priceNewCon : p.toString(),
            };

            saveTX(tx, ()=>{
                if(history){
                    return callback();
                };
                return;
            });
            
        }).catch(err=>{
            return errorHandler({'file': 'processSwap.js', 'function': 'ProcessSwap', error: err});
        });
    } catch(err){
        return errorHandler({'file': 'processSwap.js', 'function': 'processSwap', error: err});
    };
};