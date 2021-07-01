import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";

const ResetPassword = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const { resetToken } = useParams();
  // console.log("resetToken", resetToken);

  const submitForm = () => {
    if (password.length < 8) {
      return M.toast({
        html: "Your password cannot be less than 8 characters long.",
        classes: "#e53935 red darken-1",
      });
    }
    fetch("/resetpassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        resetToken,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#e53935 red darken-1" });
        } else {
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
        <h5>Set your new password</h5>
        <input
          type="password"
          placeholder="Your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="btn waves-effect waves-light #546e7a blue-grey darken-1"
          onClick={() => submitForm()}
        >
          Reset and Login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
