import token from '../models/token.js';
import errorHandler from '../errorHandler.js';

export async function findToken(address){
    return token.findOne({address: address}).lean().exec().then(item=>{
        return item;
    }).catch(err=>{
        return errorHandler({'file': 'tokenController.js', 'function': 'findToken', error: err});
    });
};

export function saveToken(data, callback){ // save new pair to database
    const newPair = new token(data);
    newPair.save((err)=>{
        if(err) return errorHandler({'file': 'tokenController.js', 'function': 'saveToken', error: err});
        callback();
    });
};