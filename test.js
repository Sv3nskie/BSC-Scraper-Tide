import Web3 from 'web3';

const web3 = new Web3('https://bsc-mainnet.nodereal.io/v1/cc2e934ea7fb477f9f086bdf119e7573');

const newBlock = 20318924;
const oldBlock = 20318924;
const blockTime = 1659798180;
const diff = newBlock - oldBlock;
const newTime = blockTime + (diff * 3);

(async()=>{
    const New = await web3.eth.getBlock(newBlock).catch(err=>{});
    console.log(New.timestamp)

})()