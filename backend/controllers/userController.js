const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../modals/userModals");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto")


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

    console.log("Entered password ",password);
    console.log("Stored password ",user.password);

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

    const message = `Your password reset token is:- \n\n ${resetPasswordURL}\n\n If you have not requested this email then please ignore it`;


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

        return next(new ErrorHander(error.message, 500));
    }
});

//RESET PASSWORD

exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

    //creating token hash
    const resetPasswordToken=crypto.createHash("sha256")
    .update(req.params.token)
    .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},

    });

    if(!user){
        return next(new ErrorHander("Reset password token is invalid or has been expired", 400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return nect(new ErrorHander("Password does not match", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200, res);

});


//GET USER DETAILS
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id);


    res.status(200).json({
        success:true,
        user,
    })

});

//UPDATE USER PASSWORD
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
         return next(new ErrorHander("Password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();


   sendToken(user,200, res);
    
});

//UPDATE USER PASSWORD

exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData= {
        name:req.body.name,
        email:req.body.email
    }

    //we will add cloudinary later
    const user =await User.findByIdAndUpdate(req.user.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });

});

//GET ALL USERS

exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    });
});


//GET SINGLE USER = ADMIN
exports.getSingleUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHander(`User does not exist with ID: ${req.params.id}`));
    };

    res.status(200).json({
        success:true,
        user,
    })
});

//Update user Role- Admin

exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });
});

//DELETE USER ADMIN
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    //we will remoce cloudinary later
    if(!user){
        return next(new ErrorHander(`User does not exists with id: ${req.params.id}`));
        
    };

    await user.deleteOne();

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully",
    });
});