import { db } from "../database/database.connection.js";

export async function createPostDB(description, url, user_id){
    await db.query(
        `INSERT INTO posts(description, url, "userId") VALUES($1, $2, $3);`,
        [description, url, user_id]
    );
}

export async function getAllPostsDB(id){
    return await db.query(`
        SELECT 
            posts.id, 
            posts.description, 
            posts.url,
            posts."userId", 
            users.username, 
            users.picture, 
        COUNT(likes.id) AS likes, 
        ARRAY_AGG(liked_by.username) AS "likedUsers"
        FROM posts
        INNER JOIN users ON posts."userId" = users.id
        LEFT JOIN follows ON follows."followedId" = users.id
        LEFT JOIN likes ON posts.id = likes."postId"
        LEFT JOIN users AS liked_by ON likes."userId" = liked_by.id
        WHERE follows."followerId" = $1 OR posts."userId" = $1
        GROUP BY
            posts.id,
            users.id
        ORDER BY posts."createdAt" DESC
        LIMIT 20;
    `, [id]);
}

export async function getPostsByIdUser(id){
    return await db.query(
        `
          
          SELECT 
            posts.id, 
            posts.description, 
            posts.url, 
            posts."userId",
            users.username, 
            users.picture, 
            COUNT(likes.id) AS likes, 
            ARRAY_AGG(liked_by.username) AS "likedUsers"
          FROM posts
          JOIN users ON posts."userId" = users.id 
          LEFT JOIN likes ON posts.id = likes."postId"
          LEFT JOIN users AS liked_by ON likes."userId" = liked_by.id
          WHERE posts."userId" = $1
          GROUP BY
            posts.id,
            users.id
          ORDER BY posts."createdAt" DESC;
          
          `,
        [id]
    );
}

export async function editPostDB(description, id, user_id){
    return await db.query(`
        UPDATE posts
        SET description = $1
        WHERE id = $2 AND "userId" = $3
        RETURNING *
        `,
        [description, id, user_id]
    );
}

export async function getPostById(id){
    return await db.query(
        `
        SELECT * FROM posts WHERE id = $1
        `,
        [id]
    );
}

export async function deletePostDB(id){
    await db.query(
        `
        DELETE FROM posts WHERE id = $1;
        `,
        [id]
      );
}

export async function likePostDB(postId, user_id){
    await db.query(`INSERT INTO likes ("postId","userId") VALUES ($1, $2);`, [
        postId,
        user_id,
    ]);
}

export async function unlikePostDb(postId, user_id){
    await db.query(`DELETE FROM likes WHERE "postId"=$1 AND "userId"=$2;`, [
        postId,
        user_id,
      ]);
}

export async function trendingDB(hashtag){
    return await db.query(
        `SELECT 
          posts.id, 
          posts.description, 
          posts.url, 
          users.username, 
          users.picture, 
          COUNT(likes.id) AS likes, 
          ARRAY_AGG(liked_by.username) AS "likedUsers"
        FROM posts
        JOIN users ON posts."userId" = users.id 
        LEFT JOIN likes ON posts.id = likes."postId"
        LEFT JOIN users AS liked_by ON likes."userId" = liked_by.id
        WHERE posts.description LIKE $1
        GROUP BY
          posts.id,
          users.id
        ORDER BY posts."createdAt" DESC
        LIMIT 20;`,
        [`%${hashtag}%`]
      );
}