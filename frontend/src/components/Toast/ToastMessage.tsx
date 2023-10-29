import "./ToastMessage.css";
import { useDispatch, useSelector } from "react-redux";
import { clearToastMessage } from "../../redux/CommonSlice";
import { useEffect } from "react";

function ToastMessage() {
  const dispatch = useDispatch();
  const toastMessage = useSelector((state: any) => state.common.toastMessage);
  useEffect(() => {
    if (toastMessage) {
      setTimeout(() => {
        dispatch(clearToastMessage({}));
      }, 2000);
    }
  }, [toastMessage]);
  if (toastMessage) {
    return (
      <div className="toast-msg-box">
        <div className="toast-msg-content">{toastMessage}</div>
      </div>
    );
  } else {
    return <></>;
  }
}

export default ToastMessage;
