const UserModel = require('../model/userModel.js');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")
const fs = require('fs');
const html = require('../utils/emailTemplate.js');
const sendMail = require('../utils/email.js');


exports.signUp = async (req, res) => {
    try {
        const { name, stack,password,email } = req.body;
        const userExist = await new UserModel.findOne({email});
        if(userExist) {
            return res.status(400).json({
                message: `User with Email: ${email} already exist`
            })
        }
        const saltPass = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password,saltPass)
        const user = new UserModel({
            name,
            stack,
            email,
            password:hash,
            image: req.file.filename
        })
        await user.save();

        const token = jwt.sign({
            userId: user._id,
            email: user.email
        },process.env.JWT_SECRET,{expiresIn:"1h"})

        const link = `localhost:5050/verify/${token}`
        const htmlTemplate = html(link,user.name)

        sendMail({
            to: user.email,
            subject: 'VERIFY YOUR EMAIL PLEASE',
            html: htmlTemplate
        })

        res.status(201).json({
            message: 'User created successfully, please verify your email',
            data: user
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.verifyUser = async (req,res)=>{
    try {
        // Extract the token from the request params
        const { token } = req.params;
        // check if the token is valid
        const decodeToken  = jwt.verify(token, process.env.JWT_SECRET);
        // Find the user with the email
        const email = decodeToken.email
        const user = await UserModel.findOne({ email });
        // Check if the user is still in the database
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }
        // Check if the user has already been verified
        if (user.isVerified === true) {
            return res.status(400).json({
                message: 'User already verified'
            })
        }
        // Verify the user
        user.isVerified = true;
        // Save the user data
        await user.save();
        // Send a success response
        res.status(200).json({
            message: 'User verified successfully'
        })
        

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.json({ message: 'Link expired.' })
        }
        res.status(500).json({
            message: error.message
        })
    }
}

exports.login = async (req,res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "user not found"
            })
        }

        if (user.password !== password) {
            return res.status(400).json({
                message: "Invalid password"
            })
        } 

        const token = jwt.sign({
            userId: user._id,
            email: user.email
        }, process.env.JWT_SECRET,{expiresIn: "1d"});


        // Send a success response
        res.status(200).json({
            message: 'User logged in successfully',
            data: user,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            message: error.messagee
        })
    }
}

exports.getOne = async (req, res) => {
    try {
        const { id } = req.params
        const oneUser = await UserModel.findById(id);
        if(!oneUser){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        res.status(200).json({
            message: 'User details',
            data: oneUser
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getAll = async (req, res) => {
    try {
        const users = await UserModel.find();
        if(users.length === 0){
            return res.status(404).json({
                message: 'No user found in this database'
            })
        }
        res.status(200).json({
            message: 'Users details',
            data: users
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const { name, stack } = req.body;
        const user = await UserModel.findById(id);
        if(!user){
            return res.status(404).json({
                message: 'User not found'
            })
        }
        const data = {
            name: name || user.name,
            stack: stack || user.stack,
            image: user.image
        }
        // Check if the user is passing a image
        if(req.file && req.file.filename) {
            // Dynamically get the old image path
            const oldFilePath = `uploads/${user.image}`
            // Check if the file exists inside of the path
            if(fs.existsSync(oldFilePath)){
                // Delete the existing image
                fs.unlinkSync(oldFilePath)
                // Update the data object
                data.image = req.file.filename
            }
        }
        // Update the changes to our database
        const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true});
        // Send a succes response to the user
        res.status(200).json({
            message: 'User details updated successfully',
            data: updatedUser
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}