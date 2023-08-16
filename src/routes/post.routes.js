import { Router } from 'express'
import postSchema from '../schemas/post.schemas';
import validateSchema from '../middlewares/validateSchema';
import { authSchemas } from '../schemas/user.schemas';
import { deletePost, editPost } from '../controllers/post.controller';

const routerPost = Router()

routerPost.put('/post/edit/:id', validateSchema(authSchemas), validateSchema(postSchema), editPost)
routerPost.delete('/post/delete/:id', validateSchema(authSchemas), deletePost)  

export default routerPost; 