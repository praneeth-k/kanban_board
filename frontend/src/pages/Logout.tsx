import { useDispatch } from "react-redux";
import { clearUserData } from "../redux/UserSlice";
import { useEffect, useState } from "react";
import { showToastMessage } from "../redux/CommonSlice";
import { useNavigate } from "react-router-dom";

function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loggedOut, setLoggedOut] = useState(false);
  useEffect(() => {
    dispatch(clearUserData({}));
    setLoggedOut(true);
    dispatch(showToastMessage({ message: "Logged Out Successfully!!!" }));
    navigate("/");
  }, []);
  return (
    <div>{loggedOut ? "Loged Out Successfully!!!" : "Logging out..."}</div>
  );
}

export default Logout;
