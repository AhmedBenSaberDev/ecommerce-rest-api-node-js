const jwt = require('jsonwebtoken');


module.exports = (req,res,next) => {
    try {
        let token = req.headers.authorization.split(' ')[1];

        if(!token){
            return res.status(500).json({message:"'Authentification failed'"});
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        req.user = {_id:decodedToken.id,isAdmin:decodedToken.isAdmin}
        next();
    } catch (err) {
        return res.status(500).json({message:"'Authentification failed'"});
    }
}