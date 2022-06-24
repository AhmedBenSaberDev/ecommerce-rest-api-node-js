const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    },
},
{
    timestamps:true
});



const UserModel = mongoose.model('User',UserSchema);

module.exports = UserModel;