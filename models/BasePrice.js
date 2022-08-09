import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
    price:{
        type: String,
    },
    block:{
        type: Number,
        index: true,
        unique: true
    },
},{collection: 'price'});

export default mongoose.model('Price', priceSchema);