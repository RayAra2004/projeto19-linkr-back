import { db } from "../database/database.connection.js";

export async function getCommentsByPost(postId, user_id) {
  return await db.query(
    `
    SELECT
    comments.*,
    users.username,
    users.picture,
    CASE WHEN follows."followerId" IS NOT NULL THEN TRUE ELSE FALSE END AS "isFollowing"
    FROM comments
    JOIN users ON users.id = comments."userId"
    LEFT JOIN follows ON follows."followerId" = $1 AND follows."followedId" = comments."userId"
    WHERE comments."postId" = $2
    `,
    [user_id, postId]
  );
}

export async function insertComments(comment, postId, user_id) {
  return db.query(
    `

    INSERT INTO comments (comment, "postId", "userId") VALUES($1, $2, $3)

    `,
    [comment, postId, user_id]
  );
}
