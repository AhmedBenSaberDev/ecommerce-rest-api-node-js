const express = require('express');
const userController = require('../controllers/user/UserController');

const checkAuth = require('../middlewares/check-auth');
const isAdmin = require('../middlewares/isAdmin');
const router = express.Router();

router.post('/login',userController.login);
router.post('/register',userController.register);
router.get('/profile',checkAuth,userController.getUserProfile);
router.get('/profile/:id',checkAuth,isAdmin,userController.getUserInfo);
router.put('/update_user/:id',checkAuth,isAdmin,userController.updateUser);
router.get('/users',checkAuth,isAdmin,userController.getUsers);
router.delete('/users/:id',checkAuth,isAdmin,userController.deleteUser);

module.exports = router;