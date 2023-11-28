import {Router, Request, Response} from "express";

import Task from "../../../models/task.model";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
    const tasks = await Task.find({ deleted: false });
    res.json({
        code: 200,
        data: tasks
    })
})

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    try {
        const task = await Task.findOne({
            _id: id,
            deleted: false
        })
        res.json({
            code: 200,
            data: task
        })
    } catch (error) {
        res.json({
            code: 400,
            message: "None existed id"
        })
    }
})

export const taskRoutes: Router = router;