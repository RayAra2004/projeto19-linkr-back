import { db } from "../database/database.connection.js";

export async function getCommentsByPost(id){

    return await db.query(`

    SELECT comments.*, users.username, users.picture FROM comments
    JOIN users ON users.id = comments."userId" WHERE comments."postId"=$1

    `,[id]);
}

export async function insertComments(comment, postId, user_id){

    return db.query(`

    INSERT INTO comments (comment, "postId", "userId") VALUES($1, $2, $3)

    `,[comment, postId, user_id]);
}
