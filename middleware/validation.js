const Joi = require('@hapi/joi');

exports.signUpValidator = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).trim().required().pattern(/^\s*[A-Za-z]+\s*$/).messages({
            "any.required": "Please provide First name.",
            "string.empty": "First name cannot be left empty.",
            "string.min": "First name must be at least 3 characters long.",
            "string.pattern.base": "First name should only contain letters.",
        }),
        stack: Joi.string().min(3).trim().required().pattern(new RegExp(/^[A-Za-z]+(?: [A-Za-z]+)*$/)).messages({
            "any.required": "Please provide Stack.",
            "string.empty": "Stack cannot be left empty.",
            "string.min": "Stack must be at least 3 characters long.",
            "string.pattern.base": "Stack should only contain letters.",
        }),
        email: Joi.string().trim().email().messages({
            "any.required": "Please provide your email address.",
            "string.empty": "Email address cannot be left empty.",
            "string.email": "Invalid email format. Please use a valid email address.",
        }),
        password: Joi.string().required().pattern(new RegExp("^(?=.[!@#$%^&])(?=.*[A-Z]).{8,}$")).messages({
            "any.required": "Please provide a password.",
            "string.empty": "Password cannot be left empty.",
            "string.pattern.base":
            "Password must be at least 8 characters long and include at least one uppercase letter and one special character (!@#$%^&*).",
        }),
    })
    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next()
}