const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
    name:{type:String,required:true},
    rating:{type:Number,required:true},
    comment:{type:String,required:true},
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps:true
});

const ProductSchema = mongoose.Schema({
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"User",
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    reviews:[ReviewSchema],
    rating:{
        type:Number,
        required:true,
        default:0
    },
    numReviews:{
        type:Number,
        required:true,
        default:0
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    countInStock:{
        type:Number,
        required:true,
        default:0
    },
    rating:{
        type:Number,
        required:true,
        default:0
    },
},
{
    timestamps:true
});


const ProductModel = mongoose.model('Product',ProductSchema);

module.exports = ProductModel;