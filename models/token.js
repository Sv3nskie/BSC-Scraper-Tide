import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    name:{
        type: String,
        index: true,
        required: true,
    },
    symbol:{
        type: String,
        required: true,
        index: true,
    },
    address:{
        type: String,
        required: true,
        unique : true,
        index: true,
    },
    decimals:{
        type: Number,
        required: true,
    },
    supply:{
        type: String,
        required: true,
    },
    // txCount:{
    //     type: Number,
    //     required: true,
    // },
    // holders:{
    //     type: Number,
    //     required: true,
    // },
    // creationBlock:{
    //     type: Number,
    //     required: true,
    // },
    // creationDate:{
    //     type: Number,
    //     required: true,
    // },
    network:{
        type: String,
        required: true,
    },
},{collection: 'tokens', timestamps: true});

export default mongoose.model('tokens', tokenSchema);