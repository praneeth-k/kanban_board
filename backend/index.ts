import express from "express";
import { StatusCodes } from "http-status-codes";
import { IsDBConnected } from "./db_connection";
import router from "./routes/auth";
import dbRoutes from "./routes/db";

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Method: ${req.method}, Path: ${req.path}`);
  next();
});

//check DB Connection
app.use((req, res, next) => {
  const excludePaths = ["/db/connect"];
  if (excludePaths.includes(req.path)) {
    next();
  } else {
    if (IsDBConnected()) return next();
    else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "DB NOT CONNECTED" });
    }
  }
});

app.use("/auth", router);
app.use("/db", dbRoutes);

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
