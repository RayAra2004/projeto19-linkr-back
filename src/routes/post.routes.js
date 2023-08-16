import { Router } from 'express'
import postSchema from '../schemas/post.schemas.js';
import validateSchema from '../middlewares/validateSchema.js';
import { authSchemas } from '../schemas/user.schemas.js';
import { authorizationValidate } from '../middlewares/authorization.js';
import { createPost } from '../controllers/post.controller.js';


const routerPost = Router()

routerPost.post('/post', authorizationValidate, validateSchema(postSchema), createPost)
//routerPost.put('/post/edit/:id', validateSchema(authSchemas), validateSchema(postSchema), editPost)
//routerPost.delete('/post/delete/:id', validateSchema(authSchemas), deletePost)  

export default routerPost; 