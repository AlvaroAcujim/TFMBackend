const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {verifyToken} = require('../middlewares/authMiddleware');

router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.get('/login/:identifier', userController.getUserByUsernameOrEmail);
router.get('/auth', verifyToken(['user', 'admin']), (req, res) => {
    res.status(200).json({message: 'autenticado'})
})

router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);


module.exports = router;