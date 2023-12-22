const ErrorHander = require("../utils/errorhandler");

module.exports = (err, req,res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";

    //WRONG MONGODB ID ERROR
    if(err.name === "CastError"){
        const message =`Resource not found. Invalid: ${err.path}`;
        err= new ErrorHander(message, 400); 
    }

    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
}