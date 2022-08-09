import tx from '../models/tx.js';
import errorHandler from '../errorHandler.js';


export function saveTX(data){
    try{
        const newTX = new tx(data);
        newTX.save((err)=>{
            if(err) return console.log(err);
        });
    } catch(err){
        errorHandler({'file': 'txController.js', 'function': 'saveTX', error: err});
    };
};