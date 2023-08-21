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