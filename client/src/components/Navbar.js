import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "./../App";

const Navbar = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <Link to="/tack/create">New tack</Link>
        </li>,
        <li key="2">
          <Link to="/my-followed-posts">My followed Tacks</Link>
        </li>,
        <li key="3">
          <Link to="/my-profile" id="profile-link">
            Profile
          </Link>
        </li>,
        <li key="4">
          <div id="logout-btn-wrapper">
            <button
              // className="btn waves-effect waves-light #bdbdbd grey lighten-1 darken-2-text"
              // className="btn-small cfd8dc blue-grey lighten-4 black-text"
              className="btn-small waves-effect waves-light #546e7a blue-grey darken-1"
              id="logout-btn"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/login");
              }}
            >
              Logout
            </button>
          </div>
        </li>,
      ];
    } else {
      return [
        <li key="5">
          <Link to="/login">Login</Link>
        </li>,
        <li key="6">
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/login"} className="brand-logo left">
          Tack
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
