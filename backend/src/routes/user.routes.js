const userRouter = require('express').Router()
const {registerUser, loginUser,logoutUser, checkUser} = require('../controllers/user.controller')

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.get('/check', checkUser);

module.exports = userRouter