import mongoose from 'mongoose';

const txSchema = new mongoose.Schema({
    uniquePoint:{
        type: String,
        required: true,
        index: true,
        unique : true,
    },
    tokenAddress:{
        type: String,
        required: true,
        index: true,
    },
    pairAddress:{
        type: String,
        required: true,
        index: true,
    },
    wallet:{
        type: String,
        required: true,
        index: true,
    },
    txHash:{
        type: String,
        required: true,
        index: true,
    },
    txIndex:{
        type: Number,
        required: true,
    },
    amount0In:{
        type: String,
        required: true,
    },
    amount1In:{
        type: String,
        required: true,
    },
    amount0Out:{
        type: String,
        required: true,
    },
    amount1Out:{
        type: String,
        required: true,
    },
    block:{
        type: Number,
        required: true,
    },
    timestamp:{
        type: Number,
        required: true,
    },
    reserves0:{
        type: String,
        required: true,
    },
    reserves1:{
        type: String,
        required: true,
    },
    base0:{
        type: Boolean,
    },
    baseDecimals:{
        type: Number,
    },
    stable:{
        type: Boolean,
    },
},{collection: 'tx', timestamps: true});

export default mongoose.model('TX', txSchema);