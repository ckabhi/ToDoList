const jwt=require('jsonwebtoken');
const key=require('../constant');

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        // console.log(token);
        const decode=jwt.verify(token,key.JWT_KEY);
        req.userData=decode;
        next();
    } catch(error){
        return res.status(401).json({
            message: "Auth Failed"
        })
    }
    
    
};