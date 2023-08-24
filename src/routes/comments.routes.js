import { Router } from 'express';
import validateSchema from '../middlewares/validateSchema.js';
import { authorizationValidate } from '../middlewares/authorization.js';
import { commentSchema } from '../schemas/comment.schema.js';
import { getComments, postComments } from '../controllers/comment.controller.js';


const routerComment = Router();

routerComment.post("/comments", authorizationValidate, validateSchema(commentSchema), postComments);
routerComment.get("/comments/:id", getComments);

export default routerComment;
