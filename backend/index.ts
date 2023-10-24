import express from 'express';
import { StatusCodes } from 'http-status-codes';
import Login from './api/login';
import Signin from './api/signin';
import { ConnectToDB, IsDBConnected } from './dbConnection';

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Method: ${req.method}, Path: ${req.path}`);
  next();
});

app.use((req, res, next) => {
  const excludePaths = ["/connect_to_db"];
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

app.post("/connect_to_db", function (req, res) {
    ConnectToDB(req, res);
  });

app.post("/login", (req, res) => {
  Login(req, res);
});

app.post("/signin", (req, res) => {
  Signin(req, res);
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
