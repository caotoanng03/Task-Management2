import { Router } from "express";
import * as controller from "../controllers/user.controller";

const router: Router = Router();

router.post("/register", controller.register);

export const userRoutes: Router = router;

