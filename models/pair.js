import mongoose from 'mongoose';

const txSchema = new mongoose.Schema({
    pairAddress:{ // pair contact address
        type: String,
        required: true,
        unique : true,
        index: true
    },
    name:{ // pair name
        type: String,
        required: true,
    },
    baseToken:{ // 
        type: String,
        required: true,
    },
    quoteToken:{
        type: String,
        required: true,
    },
    baseDecimals:{
        type: Number,
    },
    base0: { // is base token token0?
        type: Boolean,
        required: true,
    },
    stable:{ // is quote token stablecoin?
        type: Boolean,
        required: true,
    },
    // creationDate:{
    //     type: Number,
    //     required: true,
    // },
    // creationBlock:{
    //     type: Number,
    //     required: true,
    // },
    reserves0:{
        type: Number,
    },
    reserves1:{
        type: Number,
    },
    price:{
        type: Number,
    },
    volume1h:{
        type: Number,
    },
    volume24h:{
        type: Number,
    },
    volume7d:{
        type: Number,
    },
    volume30d:{
        type: Number,
    },
    marketcap:{
        type: Number,
    },
},{collection: 'pairs', timestamps: true});

export default mongoose.model('pair', txSchema);