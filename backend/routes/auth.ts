const { Router } = require("express");
const { default: LoginApi } = require("../api/auth/login");
const { default: ResetPasswordApi } = require("../api/auth/reset_password");
const { default: SigninApi } = require("../api/auth/signin");
const { default: DeleteUserApi } = require("../api/auth/delete_user");

const router = Router();

router.post("/login", (req: any, res: any) => {
  LoginApi(req, res);
});

router.post("/reset_password", (req: any, res: any) => {
  ResetPasswordApi(req, res);
});

router.post("/signin", (req: any, res: any) => {
  SigninApi(req, res);
});

router.post("/delete_user", (req: any, res: any) => {
  DeleteUserApi(req, res);
});

export default router;
