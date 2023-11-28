import { Express } from "express";
import { taskRoutes } from "./task.route";
import { userRoutes } from "./user.route";

import * as authMiddleware from "../middlewares/auth.middleware";

const mainV1Routes = (app: Express): void => {
    const version = "/api/v1";

    app.use(version + "/tasks", authMiddleware.requireAuth, taskRoutes);

    app.use(version + "/users", userRoutes);
}

export default mainV1Routes;