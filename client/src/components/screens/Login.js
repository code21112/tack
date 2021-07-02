import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "./../../App";

const Login = () => {
  const { dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitForm = () => {
    // if (
    //   !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    //     email
    //   )
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      return M.toast({
        html: "Check your email address.",
        classes: "#e53935 red darken-1",
      });
    }

    if (password.length < 8) {
      return M.toast({
        html: "Your password cannot be less than 8 characters long.",
        classes: "#e53935 red darken-1",
      });
    }
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          // console.log(data);
          dispatch({ type: "USER", payload: data.user });
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          M.toast({
            html: data.message,
            classes: "#26a69a teal lighten-1 text-#ffffff",
          });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="my-card main">
      <div
        className="card auth-card input-field"
        style={{ marginBottom: "10rem" }}
      >
        <h2>Tack</h2>
        <input
          type="text"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn waves-effect waves-light #546e7a blue-grey darken-1"
          onClick={() => submitForm()}
        >
          Login
        </button>
        <h5>
          <Link to="/signup">Create your account</Link>
        </h5>
        <h6>
          <Link to="/forgotpassword">Forgot your password?</Link>
        </h6>
      </div>
    </div>
  );
};

export default Login;
