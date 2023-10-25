import express from "express";
import { StatusCodes } from "http-status-codes";
import LoginApi from "./api/login";
import SigninApi from "./api/signin";
import { ConnectToDBApi, IsDBConnected } from "./dbConnection";
import DeleteUserApi from "./api/delete_user";
import ResetPasswordApi from "./api/reset_password";

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
  ConnectToDBApi(req, res);
});

app.post("/login", (req, res) => {
  LoginApi(req, res);
});

app.post("/reset_password", (req, res) => {
  ResetPasswordApi(req, res);
});

app.post("/signin", (req, res) => {
  SigninApi(req, res);
});

app.post("/delete_user", (req, res) => {
  DeleteUserApi(req, res);
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
