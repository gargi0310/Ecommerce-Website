const ErrorHander = require("../utils/errorhandler");

module.exports = (err, req,res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    //WRONG MONGODB ID ERROR
    if(err.name === "CastError"){
        const message =`Resource not found. Invalid: ${err.path}`;
        err= new ErrorHander(message, 400); 
    }

    //MONGOOSE DUPLICATE ERROR KEY ERROR
    if(err.code === 11000){
        const message = `Duplicate key error ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHander(message, 400);
    }

    //WRONG JWT ERROR
    if(err.name === "JsonWebTokenError"){
        const message =`Json Web token is Invalid Try again`;
        err= new ErrorHander(message, 400); 
    }

    //WRONG JWT ERROR
    if(err.name === "TokenExpireError"){
        const message =`Json Web token is expired Try again`;
        err= new ErrorHander(message, 400); 
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message,
    })
}