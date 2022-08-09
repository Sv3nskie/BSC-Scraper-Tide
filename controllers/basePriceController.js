import BasePrice from '../models/BasePrice.js';
import errorHandler from '../errorHandler.js';



export function newPrice(reserves, block){
    try{
        const token0 = (reserves.reserve0 / (10 ** 18));
        const token1 = (reserves.reserve1 / (10 ** 18));
        const price = (token1 / token0);
        const newPrice = {
            "price": price,
            "block": block
        };
        const saveNewPrice = new BasePrice(newPrice);
        saveNewPrice.save((err)=>{
            if(err){
                if(err.code == 11000) return;
                return errorHandler({'file': 'basePriceController.js', 'function': 'newPrice', error: JSON.stringify(err)});
            }
        });
    } catch(err){
        return errorHandler({'file': 'basePriceController.js', 'function': 'newPrice', error: JSON.stringify(err)});
    };
};

export function UpdatePrice(reserves, block){
    try{
        const token0 = (reserves.reserve0 / (10 ** 18));
        const token1 = (reserves.reserve1 / (10 ** 18));
        const price = (token1 / token0);
        const newPrice = {
            "price": price.toString(),
        };
        BasePrice.findOneAndUpdate({"block": block}, {newPrice}).catch(err=>{
            return errorHandler({'file': 'basePriceController.js', 'function': 'updatePrice', error: err});
        });
    } catch(err){
        return errorHandler({'file': 'basePriceController.js', 'function': 'updatePrice', error: err});
    };
};