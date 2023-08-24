import { Router } from "express"
import routerSign from "./sing.routes.js"
import routerPost from "./post.routes.js"
import routerComment from "./comments.routes.js"

const router = Router()

router.use(routerSign)
router.use(routerPost)
router.use(routerComment)

export default router