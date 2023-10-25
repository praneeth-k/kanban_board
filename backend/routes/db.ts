import { Router } from "express";
import { ConnectToDBApi } from "../db_connection";

const router = Router();

router.post("/connect", (req: any, res: any) => {
  ConnectToDBApi(req, res);
});

export default router;
