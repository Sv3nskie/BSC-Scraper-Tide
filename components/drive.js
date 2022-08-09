
import fetch from 'node-fetch';
import errorHandler from '../errorHandler.js';

const url = 'https://content-sheets.googleapis.com/v4/spreadsheets/1i7ApUDyjDve-W_w95vWI8GDD2RoDm2mEswoL2rn1MFM/values/A2%3AK69?key=AIzaSyDSjdsc-KbnjEJVsGR6QOgnJ3hJp8wVQSg';

export async function getSheet(){
    return fetch(url).then(res=>res.json()).then(res=>{
        return res.values;
    }).catch(err=>{
        errorHandler({'file': 'drive.js', 'function': 'getSheet', error: err});
    });
};