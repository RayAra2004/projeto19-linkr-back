import urlMetadata from "url-metadata";
import { createPostDB, deletePostDB, editPostDB, getAllPostsDB, getAllPostsRefreshDB, getPostById, getPostsByIdUser, likePostDB, trendingDB, unlikePostDb } from "../repositories/post.repository.js";
import { getFollower } from "../repositories/user.repository.js";
import getMetaData from "metadata-scraper";

export async function createPost(req, res) {
  const { user_id } = res.locals;
  const { url, description } = req.body;

  try {
    await createPostDB(description, url, user_id);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getAllPosts(req, res) {
  const { user_id } = res.locals;
  const { page } = req.query;

  console.log(page)

  try {
    const isFollower = await getFollower(user_id);

    const resp = await getAllPostsDB(user_id, page);

    if(resp.posts.rowCount === 0) return res.send({response: [], follower: !(isFollower.rowCount === 0)});
    let i = 0;
    const response = [];
    do {
      const metadados = await urlMetadata(resp.posts.rows[i].url);

      const metadataUrl = {
        title: metadados.title,
        url: metadados.url,
        image: metadados.image,
        description: metadados.description,
      };

      const post = { ...resp.posts.rows[i], metadataUrl };
      response.push(post);

      i++;
    } while (i < resp.posts.rows.length);

    res.send({response: response, follower: !(isFollower.rowCount === 0)});
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err);
  }
}

export async function getAllPostsRefresh(req, res) {

  const { user_id } = res.locals;

  try {
    const isFollower = await getFollower(user_id);

    const posts = await getAllPostsRefreshDB(user_id);

    if (posts.rowCount === 0)
      return res.send({ response: [], follower: !(isFollower.rowCount === 0) });
    let i = 0;
    const response = [];
    do {
      const metadados = await getMetaData(posts.rows[i].url);

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

    res.send({ response: response, follower: !(isFollower.rowCount === 0) });
  } catch (err) {
    res.status(500).send(err.message);
    console.log(err);
  }
}
export async function getPostsById(req, res) {
  const { id } = req.params;

  try {
    const posts = await getPostsByIdUser(id);

    if (posts.rowCount === 0) return res.send([]);
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
    console.log(err);
    res.status(500).send(err.message);
  }
}
export async function editPost(req, res) {
  const { id } = req.params;
  const { description } = req.body;
  const { user_id } = res.locals;

  try {
    const updateEdit = await editPostDB(description, id, user_id);

    console.log(updateEdit);

    if (updateEdit.rowCount === 0) {
      return res.sendStatus(401);
    }

    const updatedPost = {
      id: updateEdit.rows[0].id,
      description: description,
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
    const { rows: post } = await getPostById(id);

    if (post.length === 0) {
      return res.status(404).json({ message: "Post não encontrado." });
    }

    if (post[0].userId !== user_id) {
      return res
        .status(401)
        .json({ message: "Não autorizado a excluir este post." });
    }

    await deletePostDB(id);

    res.status(200).json({ message: "Post apagado com sucesso!" });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function LikePost(req, res) {
  const { postId } = req.params;
  const { user_id } = res.locals;

  try {
    await likePostDB(postId, user_id);

    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function UnlikePost(req, res) {
  const { postId } = req.params;
  const { user_id } = res.locals;

  try {
    await unlikePostDb(postId, user_id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function GetTrending(req, res) {
  const { hashtag } = req.params;

  try {
    const trendingPosts = await trendingDB(hashtag);

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
