const ProductModel = require('../../models/ProductModel');


// @desc Fetch all products 
// @route Get /api/products  
// @access Public  
module.exports.getAllProducts = async (req,res) => {

  try {
    const products = await ProductModel.find({});
    return res.json({products});
  } catch (error) {
    return res.status(500).json({message:"An error occured"})
  }

} 

// @desc Fetch single product 
// @route Get /api/products/:id  
// @access Public  
module.exports.getSingleProduct = async (req,res) => {
  let product;

    try {
      product = await ProductModel.findById(req.params.id);
    } catch (error) {
      return res.status(500).json({message:"An error occured"})
    }

    if(product){
      return res.json({product});
    }else{
      return res.status(404).json({message:"Product not found"})
    }

    
} 

// @desc Delete a single product 
// @route Delete /api/products/:id  
// @access Admin 
module.exports.deleteProduct = async (req,res) => {

  try {
    await ProductModel.findByIdAndDelete(req.params.id);
  } catch (error) {
    return res.status(500).json({message:"An error occured"})
  }

  return res.json({message:"Product deleted"});
}

// @desc Create a product 
// @route POST /api/product
// @access Admin 
module.exports.createProduct = async (req,res) => {
  const {name,price,brand,category,countInStock , description} = req.body;

  let product;

  try {
    product = await ProductModel.create({
      name,
      price,
      brand,
      category,
      countInStock,
      description,
      image:req.file.path,
      user:req.user._id
    });
  } catch (error) {
    return res.status(500).json({message:"An error occured"});
  }

  return res.json(product);
}

// @desc Edit a product 
// @route PUT /api/product/:id/edit
// @access Admin 
module.exports.editProduct = async (req,res) => {

  const {name,price,brand,category,countInStock , description} = req.body;

  let product;

  try {
    product = await ProductModel.findById(req.params.id);
  } catch (error) {
    return res.status(500).json({message:"An error occured"});
  }

  if(!product){
    return res.status(404).json({message:"Product not found"});
  }

  product.name = name;
  product.price = price;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;
  product.description = description;
  product.image = req.file.path

  try {
    await product.save();
  } catch (error) {
    
    return res.status(500).json({message:"An error occured"});
  }

  return res.json(product);
}

// @desc Create new review
// @route Post /api/products/:id/review  
// @access Private  
module.exports.addReview = async (req,res) => {

  const {rating,comment,name} = req.body;

  let product;

  try {
    product = await ProductModel.findById(req.params.id);
  } catch (error) {
    return res.status(500).json({message:"An error occured"});
  }

  if(product){
    const alreaddyReviewed = product.reviews.find(r => r.user.toString() == req.user._id.toString());
    if(alreaddyReviewed){
      return res.status(400).json({message:"Product already reviewed"})
    }

  }else{
    return res.status(404).json({message:"Product not found"});
  }

  const review = {
    name,
    comment,
    rating:Number(rating),
    user:req.user._id
  }

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc,item) => item.rating + acc, 0 ) / product.reviews.length;

  try {
    await product.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"An error occured"});
  }

  return res.status(201).json({message:"Review added"});
}