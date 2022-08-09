import Web3 from 'web3';
import Config from './components/config.js';

const {rpc2} = Config();
const web3RPC2 = new Web3(rpc2);

(()=>{
    web3RPC2.eth.getBlock(20206725).then((block)=>{
        console.log(block.timestamp);
    });
})()