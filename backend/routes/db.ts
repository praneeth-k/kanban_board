import { Router } from "express";
import { ConnectToDBApi } from "../db_connection";

const dbRouter = Router();

dbRouter.post("/connect", (req: any, res: any) => {
  ConnectToDBApi(req, res);
});

export default dbRouter;
