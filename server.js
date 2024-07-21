const express = require('express')
require("dotenv").config()
require('./config/dbConfig.js')
const userRouter = require('./router/userRouter.js');

const app = express();
app.use(express.json())

app.use('/uploads', express.static('uploads'))

app.use('/api/v1/users', userRouter)

app.listen(process.env.PORT, () => {
    console.log(`server running on PORT: ${process.env.PORT}`);
})