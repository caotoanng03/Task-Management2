import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import Task from "./models/task.model";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 1000;

app.use("/tasks", async (req: Request, res: Response) => {
    const tasks = await Task.find({ deleted: false });
    res.json({
        code: 200,
        message: "Success",
        data: tasks
    })
})


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})

