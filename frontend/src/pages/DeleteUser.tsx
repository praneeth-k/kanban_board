import { useDispatch, useSelector } from "react-redux";
import { clearUserData } from "../redux/UserSlice";
import { useEffect, useRef, useState } from "react";
import { setAlertProps, showToastMessage } from "../redux/CommonSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Constants from "../util/constants";

const DeleteUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alertProps = useSelector((state: any) => state.common.alertProps);
  const activeUser = useSelector((state: any) => state.user);
  const deleteUser = () => {
    axios
      .post(Constants.apiLinks.auth.deleteUser, { token: activeUser.token })
      .then((res: any) => {
        dispatch(clearUserData({}));
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
  };
  useEffect(() => {
    dispatch(
      setAlertProps({
        ...Constants.initialAlertProps,
        show: true,
        title: "Alert",
        message: "Are you sure of deleting your account?",
        okBtnFunc: deleteUser,
        okBtnName: "Yes",
      })
    );
  }, []);
  return <></>;
};

export default DeleteUser;
