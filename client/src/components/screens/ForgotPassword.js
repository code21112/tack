import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
// import { UserContext } from "./../../App";

const ForgotPassword = () => {
  //   const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");

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

    fetch("/forgotpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
          // console.log(data);
          //   dispatch({ type: "USER", payload: data.user });
          //   localStorage.setItem("jwt", data.token);
          //   localStorage.setItem("user", JSON.stringify(data.user));

          M.toast({
            html: data.message,
            classes: "#26a69a teal lighten-1 text-#ffffff",
          });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2>Tack</h2>
        <h5>Forgot your password?</h5>
        <h5>No need to worry.</h5>
        <h5 style={{ marginBottom: "20px" }}>Let's reset it.</h5>
        <h6>Fill out the email field to receive a reset link.</h6>
        <input
          type="text"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="btn waves-effect waves-light #546e7a blue-grey darken-1"
          onClick={() => submitForm()}
        >
          Send via email
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
