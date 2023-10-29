import { useDispatch, useSelector } from "react-redux";
import { clearUserData } from "../redux/UserSlice";
import { useEffect, useRef, useState } from "react";
import {
  closeAlert,
  setAlertProps,
  showToastMessage,
} from "../redux/CommonSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Constants from "../util/constants";
import "./../components/Login/Login.css";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showChangePasswordUI = () => {
    dispatch(
      setAlertProps({
        show: true,
        title: "Change Password",
        message: "Enter your existing Password and new Password",
        okBtnFunc: ChangePass,
        okBtnName: "Submit",
        inputElements: [
          { name: "password", value: "", inputType: "password" },
          { name: "newPassword", value: "", inputType: "password" },
        ],
      })
    );
  };
  useEffect(() => {
    showChangePasswordUI();
  }, []);
  const activeUser = useSelector((state: any) => state.user);
  const ChangePass = (formData: any) => {
    if (formData.password && formData.newPassword && activeUser.token) {
      axios
        .post(Constants.apiLinks.auth.changePassword, {
          ...formData,
          token: activeUser.token,
        })
        .then((res: any) => {
          dispatch(clearUserData({}));
          dispatch(closeAlert({}));
          dispatch(showToastMessage({ message: res.data.msg }));
          navigate("/");
        })
        .catch((err: any) => {
          const msg = err.response?.data?.msg
            ? err.response.data.msg
            : err.message;
          dispatch(
            setAlertProps({
              ...Constants.initialAlertProps,
              show: true,
              title: "Error",
              message: msg,
            })
          );
        });
    }
  };
  return <></>;
};

export default ChangePassword;
