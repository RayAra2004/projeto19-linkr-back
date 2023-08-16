import { Router } from 'express'
import { createSignUp, createSignIn} from '../controllers/sign.controllers.js'
import { usersSchemas, authSchemas  } from '../schemas/user.schemas.js'
import validateSchema from '../middlewares/validateSchema.js'




const routerSign = Router()

routerSign.post('/signup', validateSchema(usersSchemas), createSignUp)
routerSign.post('/signin', validateSchema(authSchemas), createSignIn)  

export default routerSign 