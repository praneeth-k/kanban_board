import express from "express";
import { ConnectToDBApi, IsDBConnected } from "./db_connection";
import authRouter from "./routes/auth";
import taskRouter from "./routes/task";
import cors from "cors";

const app = express();
app.use(express.json());
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
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
app.use("/task", taskRouter);

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
