const Product = require("../modals/productModal");
const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");


//CREATE PRODUCT
exports.createProduct = catchAsyncErrors(async(req,res,next)=>{

    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
});

//GET ALL PRODUCTS== ADMIN
exports.getAllProducts=catchAsyncErrors(async(req,res)=>{

    const resultPerPage = 5;
    // const productCount = await Product.countDocument();

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter().pagination(resultPerPage);
    const products = await apiFeatures.query;
    res.status(200).json({
        success:true,
        products
    })

})


//UPDATE PRODUCT==admin
exports.updateProduct=catchAsyncErrors(async(req,res,next)=>{
    let product = await Product.findById(req.params.id);
    
    if(!product){
        return next(new ErrorHander("Product not found", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        product
    })
})

//DELETE PRODUCT

exports.deleteProduct = catchAsyncErrors(async(req,res, next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found", 404))
    }

    await Product.deleteOne({_id:product});

    res.status(200).json({
        success:true,
        message:"Item removed successfully"
    });
});


//GET PRODUCT DETAILS
exports.getProductDetails = catchAsyncErrors(async(req, res, next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found", 404))
    }

    res.status(200).json({
        success:true,
        product,
        productCount,
    })
});

//CREATE NEW REVIEW
exports.createProductReview = catchAsyncErrors(async(req,res,next)=>{
    const {rating, comment, productId} = req.body;
    const review = {
        user:req.user.id,
        name:req.user.name,
        rating:Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(rev=> rev.user.toString()===req.user._id.toString())

    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev=> rev.user.toString()===req.user._id.toString())
            (rev.rating=rating), (rev.comment = comment);
        });
    }

    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    let avg = 0;
    product.reviews.forEach((rev)=>{
        avg += rev.rating;
    })

    product.ratings = avg
    / product.reviews.length;

    await product.save({validateBeforeSave:false});

    res.status(200).json({
        success:true
    });
});


//GET ALL REVIEWS
exports.getProductreviews =catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
        success:true,
        reviews:product.reviews,
    });
});

//DELETE REVIEWS
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHander("Product not found", 404));
    }

    const reviews = product.reviews.filter(rev=>rev._id.toString() !== req.query.id.toString());


    let avg = 0;
    reviews.forEach((rev)=>{
        avg += rev.rating;
    })

    const ratings = avg/reviews.length;

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(
        req.query.productId,
        {
        reviews,
        ratings,
        numOfReviews,
    },
    {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    }
    );

    res.status(200).json({
        success:true,
        reviews:product.reviews,
    });
});