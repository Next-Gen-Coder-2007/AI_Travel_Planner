const userRouter = require('express').Router()
const {registerUser, loginUser} = require('../controllers/user.controller')

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

module.exports = userRouter