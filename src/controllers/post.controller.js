import { db } from '../database/database.connection.js'

export async function editService(req, res) {

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
            url: url
        };

        res.status(200).json({ message: 'Post editado com sucesso!', updatedPost });

    } catch (err) {
        res.status(500).send(err.message);
    }
}