import { Router } from 'express'
import { createSignUp, createSignIn, getUserByUsername, isFollower, follow, unfollow} from '../controllers/sign.controllers.js'
import { usersSchemas, authSchemas  } from '../schemas/user.schemas.js'
import validateSchema from '../middlewares/validateSchema.js'
import { authorizationValidate } from '../middlewares/authorization.js'

const routerSign = Router()

routerSign.post('/sign-up', validateSchema(usersSchemas), createSignUp)
routerSign.post('/', validateSchema(authSchemas), createSignIn)
routerSign.post('/searchUser', authorizationValidate, getUserByUsername)
routerSign.get("/isFollower/:idFollwed", authorizationValidate, isFollower)
routerSign.post("/follow/:idFollwed", authorizationValidate, follow)
routerSign.delete("/follow/:idFollwed", authorizationValidate, unfollow)

export default routerSign 