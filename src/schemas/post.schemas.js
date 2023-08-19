import joi from 'joi'

const postSchema = joi.object({
    description: joi.string().allow('', null),
    url: joi.string().uri().required(),
    });

export default postSchema;