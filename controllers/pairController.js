import pair from '../models/pair.js';
import errorHandler from '../errorHandler.js';


export async function getPairs(){ // get all pairs from database
    return pair.find({}).lean().then(pairs=>{
        return pairs;
    }).catch(err=>{
        errorHandler({'file': 'pairController.js', 'function': 'getPairs', error: err});
    });
};



export function savePair(data, callback){ // save new pair to database
    try{
        const newPair = new pair(data);
        newPair.save((err)=>{
            if(err) return errorHandler({'file': 'pairController.js', 'function': 'savePair', error: err})
            callback();
        });
    } catch(err){
        errorHandler({'file': 'pairController.js', 'function': 'savePair', error: err});
    };
};