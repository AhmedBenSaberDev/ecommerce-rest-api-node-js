const express = require('express');

const ProductController = require('../controllers/product/ProductController');

const fileUpload = require('../middlewares/uploads');

const checkAuth = require('../middlewares/check-auth');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

router.get('/products',ProductController.getAllProducts);
router.post('/product',checkAuth,isAdmin,fileUpload.single('image'),ProductController.createProduct);
router.get('/product/:id',ProductController.getSingleProduct);
router.put('/product/:id/edit',checkAuth,isAdmin,fileUpload.single('image'),ProductController.editProduct);
router.post('/product/:id/review',checkAuth,ProductController.addReview);
router.delete('/product/:id',checkAuth,isAdmin,ProductController.deleteProduct);



module.exports = router;