const Product = require("../modals/productModal");
const ErrorHander = require("../utils/errorhandler");


//CREATE PRODUCT
exports.createProduct = async(req,res,next)=>{
    const product = await Product.create(req.body);

    res.status(201).json({
        success:true,
        product
    })
}


//GET ALL PRODUCTS== ADMIN
exports.getAllProducts=async(req,res)=>{
    const products = await Product.find()
    res.status(200).json({
        success:true,
        products
    })

}


//UPDATE PRODUCT==admin
exports.updateProduct=async(req,res,next)=>{
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
}

//DELETE PRODUCT

exports.deleteProduct = async(req,res, next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found", 404))
    }

    await Product.deleteOne({_id:product});

    res.status(200).json({
        success:true,
        message:"Item removed successfully"
    });
}


//GET PRODUCT DETAILS
exports.getProductDetails = async(req, res, next)=>{
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHander("Product not found", 404))
    }

    res.status(200).json({
        success:true,
        product
    })
}