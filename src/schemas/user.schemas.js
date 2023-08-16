import joi from 'joi'

export const authSchemas = joi.object({

    email: joi.string().email().required(),
    password: joi.string().required()

})

export const usersSchemas = joi.object(
    {
        username: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.string().required().valid(joi.ref("password")),
        picture: joi.string().requied().uri()
    }
)