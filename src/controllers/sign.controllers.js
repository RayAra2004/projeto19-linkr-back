import { db } from '../database/database.connection.js'
import bcrypt from 'bcrypt'
import {v4 as uuid } from 'uuid'

export async function createSignUp(req, res) {
  const { email, password, username, picture } = req.body

  try {

    if (!email || !password || !username || !picture) {
        return res.status(400).send({ mensagem: "Por favor, preencha todos os campos obrigatórios." })
      }

    const user = await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
    if (user.rowCount !== 0) return res.status(409).send({ message: "E-mail existente!" })

    //cryptografar senha
    const hash = bcrypt.hashSync(password, 10)

    await db.query(
      `INSERT INTO  users (email, password, username, picture) VALUES ($1, $2, $3, $4);`, [ email, hash, username, picture]
    )

    res.sendStatus(201)

  } catch (err) {
    res.status(500).send(err.message)
  }
}


export async function createSignIn(req, res) {
  const { email, password } = req.body

  try {
    if (!email || !password ) {
        return res.status(400).send({ mensagem: "Por favor, preencha todos os campos obrigatórios." })
      }

    const user = await db.query(`SELECT * FROM users WHERE email = $1;`, [email])
    if (user.rowCount === 0) return res.status(401).send({ messege: "E-mail não cadastrado!" })

    const passwordOk = bcrypt.compareSync(password, user.rows[0].password)
    if (!passwordOk) return res.status(401).send({ message: "Senha incorreta" })

    const token = uuid()
    await db.query(
      `INSERT INTO sessions ("userId", token) VALUES ($1, $2);`,[user.rows[0].id, token]
    )

    res.send({ token, user:{username:user.rows[0].username, id:user.rows[0].id, picture:user.rows[0].picture}  })

  } catch (err) {
    res.status(500).send(err.message)
  }
}

export async function getUserByUsername(req, res){
  const { user } = req.body;
  try{
    const users = await db.query(`SELECT id, username, picture FROM users WHERE username LIKE $1 || '%'`, [user])
    res.send(users.rows)
  }catch (err) {
    res.status(500).send(err.message)
  }

}
