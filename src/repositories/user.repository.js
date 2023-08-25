import { db } from "../database/database.connection.js";

export async function getUserByEmail(email){
    return await db.query(`SELECT * FROM users WHERE email = $1;`, [email]);
}

export async function createUser(email, hash, username, picture){
    await db.query(
        `INSERT INTO  users (email, password, username, picture) VALUES ($1, $2, $3, $4);`, [ email, hash, username, picture]
    )
}

export async function createSession(token, user){
    await db.query(
        `INSERT INTO sessions ("userId", token) VALUES ($1, $2);`,[user.rows[0].id, token]
    )
}

export async function getUserByUsernameDB(user){
    return await db.query(`SELECT id, username, picture FROM users WHERE username LIKE $1 || '%'`, [user])
}

export async function getFollower(id){
    return await db.query(
        `SELECT * FROM follows WHERE "followerId" = $1;`, [id]
    );
}

export async function isFollowerDB(id_user, id_visited){
    return await db.query(`SELECT * FROM follows WHERE "followerId" = $1 AND "followedId" = $2;`,
    [id_user, id_visited]);
}

export async function followDB(id_user, id_visited){
    await db.query(`
        INSERT INTO follows("followedId", "followerId") VALUES($1, $2);   
    `, [id_visited, id_user]);
}

export async function unfollowDB(id_user, id_visited){
    await db.query(`
        DELETE FROM follows WHERE "followedId" = $1 AND "followerId" = $2;   
    `, [id_visited, id_user]);
}