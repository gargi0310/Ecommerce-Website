const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../modals/userModals");

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name, email, password} = req.body;

    const user = await User.create({
        name, email, password,
        avatar:{
            public_id:"This is sample id",
            url:"profilepicUrl"
        }
    });

    res.status(201).json({
        success:true,
        user
    })

});

module.exports = registerUser;