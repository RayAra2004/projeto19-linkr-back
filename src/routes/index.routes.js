import { Router } from "express";
import userRouter from "./user.routes.js";
import servicesRouter from "./services.routes.js";

const router = Router();

router.use(userRouter)
router.use(servicesRouter)

export default router;