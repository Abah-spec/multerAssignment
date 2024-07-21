const express = require('express')
const { signUp, getOne, getAll, updateUser, verifyUser } = require('../controller/userController')
const upload = require('../utils/multer.js')
const router = express.Router()
const {signUpValidator} = require("../middleware/validation")

router.post('/sign-up',signUpValidator, upload.single('image'), signUp)

router.get('/one/:id', getOne)

router.get('/all', getAll)

router.put('/update/:id', upload.single('image'), updateUser)

router.put('/verify/:token', verifyUser)

module.exports = router;