import joi from 'joi'

export const postSchema = joi.object({
    description: joi.string().allow('', null),
    url: joi.string().uri().required(),
    });

    export const newPostSchema = joi.object({
        description: joi.string().allow('', null)
        });
        