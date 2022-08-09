import BasePrice from '../models/BasePrice.js';
import errorHandler from '../errorHandler.js';
import {newPrice, UpdatePrice} from '../controllers/basePriceController.js';
import { getSync } from './nodeRequests.js';


export default async function SaveBasePrice(data, reserve){
    try{
        const sync = reserve ? null : getSync(data);

        Promise.all([BasePrice.findOne({"block": data.blockNumber}), sync]).then(d=>{
            const [blockNr, reserves] = d;
            const sendReserves = (sync == null ? reserve : reserves);

            if(!blockNr){
                newPrice(sendReserves, data.blockNumber);
            } else {
                UpdatePrice(sendReserves, blockNr.block);
            };
        });
    } catch(err){
        errorHandler({'file': 'saveBasePrice.js', 'function': 'saveBasePrice', error: err});
    };
};