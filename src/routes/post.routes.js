import { Router } from 'express'
import postSchema from '../schemas/post.schemas.js';
import validateSchema from '../middlewares/validateSchema.js';
import { authSchemas } from '../schemas/user.schemas.js';
import { deletePost, editPost, createPost, getAllPosts, LikePost, UnlikePost } from '../controllers/post.controller.js'

const routerPost = Router()

routerPost.post('/post', authorizationValidate, validateSchema(postSchema), createPost)
routerPost.get('/posts', getAllPosts)
routerPost.get('/posts/:id', getPostsById)
routerPost.post('/posts/:postId/like', authorizationValidate, LikePost)
routerPost.delete('/posts/:postId/like', authorizationValidate, UnlikePost)
routerPost.put('/post/edit/:id', validateSchema(authSchemas), validateSchema(postSchema), editPost)
routerPost.delete('/post/delete/:id', validateSchema(authSchemas), deletePost)  

export default routerPost; 