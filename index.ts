import express, {Express} from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import mainV1Routes from "./api/v1/routes/index.route";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 1000;

mainV1Routes(app);


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})

