import "./Navbar.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Navbar() {
  const activeUser = useSelector((state: any) => state.user);
  return (
    <div className="nav row-flex space-between center-cross">
      <Link to="/" className="nav-title row-flex center-cross">
        <img src={"tasks.svg"} alt="nav-logo" style={{ width: "50px" }} />
        Kanban Board
      </Link>
      <span>{activeUser?.name && activeUser.name}</span>
      <div className="nav-menu row-flex space-evenly">
        {activeUser?.name && (
          <>
            <Link to="/logout" className="nav-item">
              Logout
            </Link>
            <Link to="/change-password" className="nav-item">
              ChangePassword
            </Link>
            <Link to="/delete-user" className="nav-item">
              DeleteUser
            </Link>
          </>
        )}
        <>
          <Link to="/about" className="nav-item">
            About
          </Link>
        </>
      </div>
    </div>
  );
}

export default Navbar;
