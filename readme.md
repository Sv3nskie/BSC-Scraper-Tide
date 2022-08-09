#### BSC Scraper for PancakeSwap using web3 socket and RPC



## example of a swap log from the rpc node

```
{
    address: '0x620042030264375210768a47b8f3724EDfa2969d', // pair address
    topics: [
      '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822', // swap - PancakeSwap
      '0x00000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e', // sender - router address
      '0x000000000000000000000000623aef6338a5e6e2ff5ea08ccab1286a218ad489' // receiver - seller/buyer
    ],
    data: // data contain 0in, 1in, 0out, 1out '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c9ab8807e816330000000000000000000000000000000000000000000000b912d837b5302461650000000000000000000000000000000000000000000000000000000000000000',
    blockNumber: 20163268, // blocknumber, still need to get timestamp from that
    transactionHash: '0xfcff329f0cbd4e484403cf696e05110f1c39b16d217cd13c3aa2202c492792c3',
    transactionIndex: 79,
    blockHash: '0xec1e1e5702d9443a53bc42a6a7f3ee45fe1fac8d0ef457019723f089cafc5627',
    logIndex: 301, // txIndex = 301, then the sync event for the reserves ot the pair will be 300, we need that to get new price
    removed: false,
    id: 'log_e10f9b98'
}
```


## PancakeSwap swap event data

```
event Swap( // decoded swap event = 0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822 - topic 0
    address indexed sender, // indexed = topic 1
    uint amount0In, // not indexed = data 0
    uint amount1In, // not indexed = data 1
    uint amount0Out, // not indexed = data 2
    uint amount1Out, // not indexed = data 3
    address indexed to // indexed = topic 2
);
```