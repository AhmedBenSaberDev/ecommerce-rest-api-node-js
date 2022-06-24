const bcrypt = require('bcrypt');
const UserModel = require('../../models/UserModel');

const generateToken = require('../../utils/generateToken');

// @desc Login a new user 
// @route Post /api/login
// @access Public
module.exports.login = async (req,res) => {

    const {email,password} = req.body;

    let user;
    let checkPassword;
    try {
        user = await UserModel.findOne({email});
    } catch (error) {
        return res.status(500).json({message:"An error occured"});
    }

    if(user){
        checkPassword = await bcrypt.compare(password,user.password);
        if(checkPassword){
            return res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin,
                token:generateToken(user._id,user.isAdmin)
            })
        }
    }

    return res.status(401).json({message:"Invalid email or password"});
}

// @desc Get user info
// @route Get /api/profile
// @access Private
module.exports.getUserProfile = async (req,res) => {

    try {
        const user = await UserModel.findById(req.user._id);
        if(user){
            return res.json({
                _id:user._id,
                name:user.name,
                email:user.email,
                isAdmin:user.isAdmin
            })
        }
    } catch (error) {
        return res.status(500).json({message:"An error occured"});
    }

    return res.status(404).json({message:"User not found"});

}

// @desc Get user info
// @route Get /api/profile/:id
// @access Admin
module.exports.getUserInfo = async (req,res) => {

    let user;

    try {
        user = await UserModel.findById(req.params.id).select('-pasword');
    } catch (error) {
        res.status(500).json({message:"An error occured"});
    }

    if(!user){
        return res.status(404).json( {message:"User not found"});
    }
    return res.json(user);
}
// @desc Edit user
// @route Put /api/update_user/:id
// @access Admin
module.exports.updateUser = async (req,res) => {
    let user;

    try {
        user = await UserModel.findById(req.params.id).select('-pasword');
    } catch (error) {
        return res.status(500).json({message:"An error occured"});
    }

    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    user.name = req.body.name;
    user.email = req.body.email;
    user.isAdmin = req.body.isAdmin;

    try {
        await user.save()
    } catch (error) {
        if (error.name === 'MongoServerError' && error.code === 11000) {
            return res.status(400).json({message:'This email already exists'});
        } else 
        return res.status(500).json({message:"An error occured"});
    }

    return res.json(user);
}

// @desc Register a new user 
// @route Post /api/register
// @access Public
module.exports.register = async (req,res) => {
    const { name,password,passwordConfirm,email} = req.body;

    let userExists ;

    try {
        userExists = await UserModel.findOne({email});
    } catch (error) {
        return res.status(500).json({message:"An error occured"});
    }
    if(userExists){
        return res.status(422).json({message:"Email already exists"})
    }
    let newUser;
    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password,10);
    } catch (error) {
        return res.status(500).json({pass:"pass"});
    }
    try {
         newUser = await UserModel.create({
            name,
            email,
            password:hashedPassword
        });
    } catch (error) {
        return res.status(500).json({error});
    } 

    return res.json({
        _id:newUser._id,
        name:newUser.name,
        email:newUser.email,
        isAdmin:newUser.isAdmin,
        token:generateToken(newUser._id)
    });
}

// @desc Get all users 
// @route Get /api/users
// @access Admin
module.exports.getUsers = async (req,res) => {

    let users;

    try {
        users = await UserModel.find({});
    } catch (error) {
        res.status(500).json({message:"An error occured"})
    }
    return res.json(users);
}

// @desc Delete a user 
// @route Delete /api/users/:id
// @access Admin
module.exports.deleteUser = async (req,res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
    } catch (error) {
        res.status(500).json({message:"An error occured"})
    }
    return res.json({message:"User deleted"});
}