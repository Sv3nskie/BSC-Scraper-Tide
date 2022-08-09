import fs from 'fs';

const date = new Date();

export default function errorHandler(err){
    console.log(err)
    fs.appendFile('./errorReport.txt', `${date}: - ${JSON.stringify(err)}\r\n ---- \r\n`, (error)=>{
        if(error) return;
    });
};