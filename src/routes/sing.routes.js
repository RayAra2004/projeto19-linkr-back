import { Router } from 'express'
import { createSignUp, createSignIn} from '../controllers/sign.controllers.js'
import { usersSchemas, authSchemas  } from '../schemas/user.schemas.js'
import validateSchema from '../middlewares/validateSchema.js'




const routerSign = Router()

routerSign.post('/sign-up', validateSchema(usersSchemas), createSignUp)
routerSign.post('/', validateSchema(authSchemas), createSignIn)  

export default routerSign 