const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../modals/userModals");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js")


exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const {name, email, password} = req.body;

    const user = await User.create({
        name, email, password,
        avatar:{
            public_id:"This is sample id",
            url:"profilepicUrl"
        }
    });

    sendToken(user,201, res);

});



//LOGIN USER

exports.loginUser = catchAsyncErrors(async(req,res,next)=>{

    const {email, password} = req.body;

    //checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHander("Please enter email and password", 400));
    }

    const user =await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHander("Invalid email or password", 401));
    }

    const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHander("Invalid email or password", 401));
    }

    sendToken(user,200, res);
});


//LOGOUT

exports.logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token", null, {
        expires:new Date(Date.now()),
        httpOnly:true,
    })

    res.status(200).json({
        success:true,
        message:"Logged out",
    })
});


//FORGOT PASSWORD

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});


    if(!user){
        return next(new ErrorHander("User not found", 404));
    }

    //get Reset Password token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is:- \n\n ${resetPasswordURL}\n\n If you have not requested this email then please igonre it`;


    try {

        await sendEmail({
            email:user.email,
            subject:`Ecommerce Pasword Recovery`,
            message,
        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        });
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave:false});

        return next(new ErrorHnader(error.message, 500));
    }
});