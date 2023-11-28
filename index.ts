import express, {Express} from "express";
import dotenv from "dotenv";
import * as database from "./config/database";
import mainV1Routes from "./api/v1/routes/index.route";

dotenv.config();

database.connect();

const app: Express = express();
const port: number | string = process.env.PORT || 1000;

// dùng này thì không cần dùng body-parser khi gửi bằng phương thức patch 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mainV1Routes(app);


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})

