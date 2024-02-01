import {app} from "./settings";
import {runDb} from "./db/runDb";
import dotenv from 'dotenv'
dotenv.config()

const port = process.env.PORT || 3000;

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`[server]: Server is running with port:${port}`);
    });
}

startApp()