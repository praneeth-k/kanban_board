import "./Login.css";
import { useRef, useState } from "react";
import axios from "axios";
import Constants from "../../util/constants";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../../redux/UserSlice";
import { setAlertProps, showToastMessage } from "../../redux/CommonSlice";

function Login() {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const dispatch = useDispatch();
  const createNewUser = () => {
    axios
      .post(Constants.apiLinks.auth.signin, formData)
      .then((res: any) => {
        if (res.data.user && res.data.token)
          dispatch(
            setActiveUser({ name: res.data.user.name, token: res.data.token })
          );
        dispatch(showToastMessage({ message: res.data.msg }));
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
  const onFormUpdate = (evt: any) => {
    let _formData = { ...formData };
    if (evt.target.name) {
      _formData[evt.target.name as keyof Object] = evt.target.value;
    }
    setFormData(_formData);
  };
  const LoginUser = () => {
    if (formData.name && formData.password) {
      axios
        .post(Constants.apiLinks.auth.login, formData)
        .then((res: any) => {
          if (res.data.user && res.data.token)
            dispatch(
              setActiveUser({ name: res.data.user.name, token: res.data.token })
            );
          dispatch(showToastMessage({ message: res.data.msg }));
          setFormData({ name: "", password: "" });
        })
        .catch((err: any) => {
          if (err.response?.data?.msg?.toUpperCase() == "USER NOT FOUND") {
            dispatch(
              setAlertProps({
                ...Constants.initialAlertProps,
                show: true,
                title: "Error",
                message: "User not found, do you want to create a new account?",
                okBtnFunc: createNewUser,
                okBtnName: "Yes",
              })
            );
          } else {
            const msg = err.response?.data?.msg
              ? err.response.data.msg
              : err.message;
            dispatch(
              setAlertProps({
                ...Constants.initialAlertProps,
                show: true,
                title: "Error",
                message: msg,
                okBtnFunc: null,
                okBtnName: "",
                inputElements: [],
              })
            );
          }
        });
    }
  };
  return (
    <div
      className="modal fade"
      id="myModal"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content clearfix">
          <div className="modal-body">
            <div className="modal-body">
              <h3 className="title">Login Form</h3>
              <p className="description">Login here Using Name & Password</p>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter name"
                  name="name"
                  onChange={onFormUpdate}
                  value={formData.name}
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  name="password"
                  onChange={onFormUpdate}
                  value={formData.password}
                />
              </div>
              <button className="btn" onClick={LoginUser}>
                Login / Signin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
