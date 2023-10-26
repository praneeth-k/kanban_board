import express from "express";
import { StatusCodes } from "http-status-codes";
import { ConnectToDBApi, IsDBConnected } from "./db_connection";
import authRouter from "./routes/auth";
import dbRoutes from "./routes/db";
import taskRouter from "./routes/task";

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
      ConnectToDBApi(req, res, next);
    }
  }
});

app.use("/auth", authRouter);
// app.use("/db", dbRoutes);
app.use("/task", taskRouter);

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
