import mongoose from 'mongoose';
import Scraper from './components/scraper.js'
import Config from './components/config.js'
import { getSheet } from './components/drive.js';
import {getPairs, savePair} from './controllers/pairController.js';
import {findToken, saveToken} from './controllers/tokenController.js';
import {baseToken, getDecimals, getSupply, getName} from './components/nodeRequests.js';
import errorHandler from './errorHandler.js';

const {database, stable} = Config();

let sequencer = Promise.resolve();
let pairs = [] // {pairAddress, decimals, stable, base0, baseToken}
let tokens = []; // just to make sure we not try too save double tokens

const createNewToken = (address, symbol)=>{
    return new Promise(async(resolve, reject)=>{
        const tokenExists = await findToken(address);
        if(!tokenExists && !tokens.includes(address)){
            tokens.push(address)
            Promise.all([getName(address), getDecimals(address), getSupply(address)]).then(d=>{
                const [name, decimals, supply] = d;
                const token = {
                    address: address,
                    name: name,
                    symbol: symbol,
                    decimals: decimals,
                    supply: supply,
                    network: 'BSC',
                };
        
                saveToken(token, ()=>{
                    resolve();
                });
                
            }).catch(err=>{
                errorHandler({'file': 'app.js', 'function': 'createNewToken', error: err});
            });
        } else {
            resolve();
        };
    });
};

const createNewPair = (data)=>{
    try{
        return new Promise((resolve, reject)=>{
            Promise.all([getDecimals(data[1]), baseToken(data[5])]).then(d=>{
                const [decimals, base] = d;
                
                const setPair = {
                    pairAddress: data[5], 
                    baseDecimals: decimals, 
                    stable: data[3] == stable ? true : false, 
                    base0: base == data[5] ? true : false, 
                    baseToken: data[1]
                };

                pairs.push(setPair);

                const pair = {
                    pairAddress: data[5],
                    name: data[4], 
                    baseToken: data[1], 
                    quoteToken: data[3], 
                    base0: base == data[5] ? true : false, // call function to get boolean
                    stable: data[3] == stable ? true : false,
                    baseDecimals: decimals,
                };

                savePair(pair, ()=>{
                    return resolve();
                });
    
            }).catch(err=>{
                return errorHandler({'file': 'app.js', 'function': 'createNewPair', error: err});
            });
        });
    } catch(err){
        errorHandler({'file': 'app.js', 'function': 'createNewPair', error: err});
    };
};

mongoose.connect(database);
mongoose.connection.on('error', err => {
    errorHandler({'file': 'app.js', 'function': 'databaseConnect', error: err});
}).on('connected', async()=>{

    Promise.all([getPairs(), getSheet()]).then(data=>{
        const [existingPairs, wantedPairs] = data;

        if(existingPairs.length != 0){
            existingPairs.forEach(item=>{
                const {pairAddress, baseDecimals, stable, base0, baseToken} = item;
                const setPair = {
                    pairAddress: pairAddress, 
                    baseDecimals: baseDecimals, 
                    stable: stable, 
                    base0: base0, 
                    baseToken: baseToken
                };
                pairs.push(setPair);
            });
        };

        wantedPairs.forEach(item=>{
            const exists = existingPairs.find(({pairAddress}) => pairAddress === item[5]);
            if(exists == undefined){
                sequencer = Promise.all([sequencer, createNewPair(item)]);
                sequencer = [sequencer,createNewToken(item[1], item[0])];
            };
        });

        setTimeout(()=>{
            Promise.all([sequencer]).then(()=>{
                return Scraper(pairs);
            });
        }, 1000);

    }).catch(err=>{
        errorHandler({'file': 'app.js', 'function': 'databaseConnect', error: err});
    });
});