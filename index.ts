import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import Task from "./models/task.model";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 1000;

app.get("/tasks", async (req: Request, res: Response) => {
    const tasks = await Task.find({ deleted: false });
    res.json({
        code: 200,
        data: tasks
    })
})

app.get("/tasks/:id", async (req: Request, res: Response): Promise<void> => {
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


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})

