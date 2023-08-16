import joi from 'joi'

const postSchema = joi.object({
    id: joi.number().integer().positive(),
    description: joi.string().required(),
    url: joi.string().uri().required(),
    likes: joi.number().integer().min(0),
    userId: joi.number().integer().positive(),
    createdAt: joi.date().timestamp().default(() => new Date(), 'current timestamp'),
    });

export default postSchema;