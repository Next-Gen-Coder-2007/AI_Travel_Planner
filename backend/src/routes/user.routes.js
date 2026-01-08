const userRouter = require('express').Router()
const {registerUser, loginUser, checkUser} = require('../controllers/user.controller')

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/check', checkUser);

module.exports = userRouter