import { Router } from "express";
import * as controller from "../controllers/user.controller";

const router: Router = Router();

router.get("/", controller.index);

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/logout", controller.logout);

export const userRoutes: Router = router;

