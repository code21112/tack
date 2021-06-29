import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import Loader from "./../utilities/Loader";

const Signup = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [showSignupLink, setShowSignupLink] = useState(true);

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "new-tack");
    data.append("cloud_name", "dt1b4wuyh");
    fetch("https://api.cloudinary.com/v1_1/dt1b4wuyh/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
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
        html: "Your password must be 8 characters long at least.",
        classes: "#e53935 red darken-1",
      });
    }
    setLoading(true);
    setShowSignupLink(false);
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic: url,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.error) {
          setLoading(false);
          setShowSignupLink(true);
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

  const submitForm = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2>Tack</h2>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <div className="file-field input-field">
          <div className="btn">
            <span>Upload</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input
              className="file-path validate"
              type="text"
              placeholder="Upload your profile pic (optional)"
            />
          </div>
        </div>

        <button
          className="btn waves-effect waves-light #546e7a blue-grey darken-1"
          onClick={() => submitForm()}
        >
          Signup
        </button>
        {loading ? <Loader /> : null}
        {showSignupLink ? (
          <h5>
            <Link to="/login">Already have an account ?</Link>
          </h5>
        ) : null}
      </div>
    </div>
  );
};

export default Signup;
