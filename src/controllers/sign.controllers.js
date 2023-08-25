import bcrypt from 'bcrypt'
import {v4 as uuid } from 'uuid'
import { createSession, createUser, followDB, getUserByEmail, getUserByUsernameDB, isFollowerDB, unfollowDB } from '../repositories/user.repository.js'

export async function createSignUp(req, res) {
  const { email, password, username, picture } = req.body

  try {

    if (!email || !password || !username || !picture) {
        return res.status(400).send({ mensagem: "Por favor, preencha todos os campos obrigatórios." })
      }

    const user = await getUserByEmail(email);
    if (user.rowCount !== 0) return res.status(409).send({ message: "E-mail existente!" })

    //cryptografar senha
    const hash = bcrypt.hashSync(password, 10)

    await createUser(email, hash, username, picture);

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

    const user = await getUserByEmail(email);
    if (user.rowCount === 0) return res.status(401).send({ messege: "E-mail não cadastrado!" })

    const passwordOk = bcrypt.compareSync(password, user.rows[0].password)
    if (!passwordOk) return res.status(401).send({ message: "Senha incorreta" })

    const token = uuid()
    createSession(token, user)

    res.send({ token, user:{username:user.rows[0].username, id:user.rows[0].id, picture:user.rows[0].picture}  })

  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
}

export async function getUserByUsername(req, res){
  const { user } = req.body;
  try{
    const users = await getUserByUsernameDB(user);
    res.send(users.rows)
  }catch (err) {
    res.status(500).send(err.message)
  }

}

export async function isFollower(req, res){
  const { user_id } = res.locals;
  const { idFollwed } = req.params;
  let follow = false;

  try {
    const isFollower = await isFollowerDB(user_id, idFollwed);
    if(isFollower.rowCount !== 0) follow = true;

    res.send({isFollower: follow});

  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

export async function follow(req, res){
  const { idFollwed } = req.params;
  const { user_id } = res.locals;

  try {
    await followDB(user_id, idFollwed);
    res.sendStatus(201);
    
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}

export async function unfollow(req, res){
  const { idFollwed } = req.params;
  const { user_id } = res.locals;

  try {
    await unfollowDB(user_id, idFollwed);
    res.sendStatus(200);
    
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
}