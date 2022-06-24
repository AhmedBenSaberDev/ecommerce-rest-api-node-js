module.exports = (req,res,next) => {
    if(req.user?.isAdmin){
        next();
    }else{
        return res.status(401).json({message:"Not authorized"})
    }
}