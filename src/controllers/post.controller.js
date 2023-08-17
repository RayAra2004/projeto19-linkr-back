import { db } from "../database/database.connection.js";
import urlMetadata from "url-metadata";

export async function createPost(req, res) {
    const { user_id } = res.locals;
    const { url, description } = req.body;

    try {
        await db.query(
            `INSERT INTO posts(description, url, "userId") VALUES($1, $2, $3);`,
            [description, url, user_id]
        );
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}


export async function getAllPosts(req, res) {
    try {
        const posts = await db.query(`
            SELECT posts.id, posts.description, posts.url, users.username, users.picture, COUNT(likes.id) AS likes FROM posts
            JOIN users ON posts."userId" = users.id 
            LEFT JOIN likes ON posts.id = likes."postId"
            GROUP BY
            posts.id,
            users.id
            ORDER BY posts."createdAt" DESC
            LIMIT 20;
        `);

        let i = 0;
        const response = [];
        do {
            const metadados = await urlMetadata(posts.rows[i].url);

            const metadataUrl = {
                title: metadados.title,
                url: metadados.url,
                image: metadados.image,
                description: metadados.description,
            };

            const post = { ...posts.rows[i], metadataUrl };
            response.push(post);

            i++;
        } while (i < posts.rows.length);
      
    res.send(response);
  } catch (err) {
    res.status(500).send(err.message);
  }

}
export async function getPostsById(req, res) {

    const { id } = req.params;

    try {

        const { rows: userPosts } = await db.query(`
        
            SELECT * FROM posts WHERE "userId"=$1
        
        `, [id]);


        if (!userPosts.length > 0) {

            return res.sendStatus(404);
        }

        const posts = userPosts.rows

        res.status(200).json(posts);

    } catch (err) {
        res.status(500).send(err.message);
    }

}
export async function editPost(req, res) {
    const { id } = req.params;
    const { description, url } = req.body;

    try {
        const { rows: post } = await db.query(
            `
            SELECT * FROM post WHERE id = $1
            `,
            [id]
        );

        if (post.length === 0) {
            return res.sendStatus(404);
        }

        await db.query(
            `
            UPDATE posts
            SET description = $1, url = $2
            WHERE id = $3
            RETURNING *
            `,
            [description, url, id]
        );

        const updatedPost = {
            id: post[0].id,
            description: description,
            url: url,
        };

        res.status(200).json({ message: "Post editado com sucesso!", updatedPost });
    } catch (err) {
        res.status(500).send(err.message);
    }
}
export async function deletePost(req, res) {
    const { id } = req.params;

    try {
        const { rows: post } = await db.query(
            `

            SELECT * FROM posts WHERE id=$1
        
        `,
            [id]
        );

        if (post.length === 0) {
            return res.sendStatus(404);
        }

        const { rows: user } = await db.query(
            `

            SELECT * FROM users WHERE id=$1
        
        `,
            [id]
        );

        if (user.id !== post.userId) {
            return res.sendStatus(401);
        }

        await db.query(
            `

            DELETE FROM post WHERE id = $1

        `,
            [id]
        );

        res.status(204).json({ message: "Post apagado com sucesso!" });
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function LikePost(req, res) {
    const { postId } = req.params;
    const { user_id } = res.locals;

    try {
        await db.query(`INSERT INTO likes ("postId","userId") VALUES ($1, $2);`, [
            postId,
            user_id,
        ]);

        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function UnlikePost(req, res) {
    const { postId } = req.params;
    const { user_id } = res.locals;

    try {
        await db.query(`DELETE FROM likes WHERE "postId"=$1 AND "userId"=$2;`, [
            postId,
            user_id,
        ]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
