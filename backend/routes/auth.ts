import { Router } from "express";
import LoginApi from "../api/auth/login";
import ChangePasswordApi from "../api/auth/change_password";
import SigninApi from "../api/auth/signin";
import DeleteUserApi from "../api/auth/delete_user";

const authRouter = Router();

authRouter.post("/login", (req: any, res: any) => {
  LoginApi(req, res);
});

authRouter.post("/change_password", (req: any, res: any) => {
  ChangePasswordApi(req, res);
});

authRouter.post("/signin", (req: any, res: any) => {
  SigninApi(req, res);
});

authRouter.post("/delete_user", (req: any, res: any) => {
  DeleteUserApi(req, res);
});

export default authRouter;
