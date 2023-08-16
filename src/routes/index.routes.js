import { Router } from "express"
import routerSign from "./sing.routes.js"
import routerPost from "./post.routes.js"

const router = Router()

router.use(routerSign)
router.use(routerPost)


export default router