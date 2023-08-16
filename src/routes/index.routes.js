import { Router } from "express"
import routerSign from "./sing.routes.js"

const router = Router()

router.use(routerSign)


export default router