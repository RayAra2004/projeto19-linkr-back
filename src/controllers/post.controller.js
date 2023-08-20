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
      GROUP BY
        posts.id,
        users.id
      ORDER BY posts."createdAt" DESC
      LIMIT 20;
        `);

    if(posts.rowCount === 0) return res.send([]);
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
    console.log(err);
  }
}
export async function getPostsById(req, res) {
  const { id } = req.params;
  
  
  try {
    const posts = await db.query(
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

    if(posts.rowCount === 0) return res.send([]);
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


    res.status(200).send(response);
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message);
  }
}
export async function editPost(req, res) {
  const { id } = req.params;
  const { description } = req.body;
  const { user_id } = res.locals;

  try {

    const updateEdit = await db.query(`
            UPDATE posts
            SET description = $1
            WHERE id = $2 AND "userId" = $3
            RETURNING *
            `,
      [description, id, user_id]
    );

    console.log(updateEdit)

    if (updateEdit.rowCount === 0) {
      return res.sendStatus(401)
    }

    const updatedPost = {
      id: updateEdit.rows[0].id,
      description: description
    };

    res.status(200).json({ message: "Post editado com sucesso!", updatedPost });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
}
export async function deletePost(req, res) {
  const { id } = req.params;
  const { user_id } = res.locals;

  try {
    const { rows: post } = await db.query(
      `
      SELECT * FROM posts WHERE id = $1
      `,
      [id]
    );

    if (post.length === 0) {
      return res.status(404).json({ message: "Post não encontrado." });
    }

    if (post[0].userId !== user_id) {
      return res.status(401).json({ message: "Não autorizado a excluir este post." });
    }

    await db.query(
      `
      DELETE FROM posts WHERE id = $1
      `,
      [id]
    );

    res.status(200).json({ message: "Post apagado com sucesso!" });
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

export async function GetTrending(req, res) {
  const { hashtag } = req.params;

  try {
    const trendingPosts = await db.query(
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

    let i = 0;
    const response = [];
    do {
      const metadados = await urlMetadata(trendingPosts.rows[i].url);

      const metadataUrl = {
        title: metadados.title,
        url: metadados.url,
        image: metadados.image,
        description: metadados.description,
      };

      const post = { ...trendingPosts.rows[i], metadataUrl };
      response.push(post);

      i++;
    } while (i < trendingPosts.rows.length);

    res.send(response).status(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
