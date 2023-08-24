
import { getCommentsByPost, insertComments } from "../repositories/comment.reository.js";

export async function postComments(req, res) {

    const { user_id } = res.locals;
    const { comment, postId } = req.body;

    try {
        await insertComments(comment, postId, user_id)
        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

export async function getComments(req, res) {

    const { id } = req.params;
        console.log(id);
    try {
        const commentList = await getCommentsByPost(id)

        res.status(200).send(commentList.rows);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
}

