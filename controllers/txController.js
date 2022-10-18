import tx from '../models/tx.js';
import errorHandler from '../errorHandler.js';


export function saveTX(data, callback){
    try{
        const newTX = new tx(data);
        newTX.save((err)=>{
            if(err){
                if(err.code == 11000) return;
                callback();
                return console.log(err.code)
            };
            return callback();
        });
    } catch(err){
        return errorHandler({'file': 'txController.js', 'function': 'saveTX', error: err});
    };
};