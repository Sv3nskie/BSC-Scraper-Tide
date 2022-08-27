import Web3 from 'web3';

const web3 = new Web3('https://bsc-mainnet.nodereal.io/v1/cc2e934ea7fb477f9f086bdf119e7573');

const x = '287548895035951746385223' / (100 ** 18);
const y = '94172983551094491669633813' / (100 ** 18);

const a = x/y;
const b = y/x;

console.log(a, b);