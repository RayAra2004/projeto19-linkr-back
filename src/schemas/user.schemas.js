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
        picture: joi.string().required().uri()
    }
)