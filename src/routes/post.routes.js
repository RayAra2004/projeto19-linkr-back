import { Router } from "express";
import  { newPostSchema, postSchema} from "../schemas/post.schemas.js";
import validateSchema from "../middlewares/validateSchema.js";
import { authSchemas } from "../schemas/user.schemas.js";
import {
    deletePost,
    editPost,
    createPost,
    getAllPosts,
    LikePost,
    UnlikePost,
    getPostsById,
    GetTrending,
} from "../controllers/post.controller.js";
import { authorizationValidate } from "../middlewares/authorization.js";

const routerPost = Router();

routerPost.post(
    "/post",
    authorizationValidate,
    validateSchema(postSchema),
    createPost
);
routerPost.get("/posts", getAllPosts);
routerPost.get("/posts/:id", getPostsById);
routerPost.post("/posts/:postId/like", authorizationValidate, LikePost);
routerPost.delete("/posts/:postId/like", authorizationValidate, UnlikePost);
routerPost.put(
    "/post/edit/:id",
    authorizationValidate,
    validateSchema(newPostSchema),
    editPost
);
routerPost.delete("/post/delete/:id", authorizationValidate, deletePost);
routerPost.get("/hashtag/:hashtag", GetTrending);

export default routerPost;
