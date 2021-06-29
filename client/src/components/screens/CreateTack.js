import React, { useState, useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";
import Loader from "./../utilities/Loader";

const CreateTack = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url) {
      fetch("/post/create", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          title,
          body,
          url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({
              html: "Created post Successfully",
              classes: "#43a047 green darken-1",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const tackDetails = () => {
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "new-tack");
    // data.append("allowed_formats", ["jpg", "png", "jpeg", "tiff", "raw"]);
    data.append("cloud_name", "dt1b4wuyh");
    fetch("https://api.cloudinary.com/v1_1/dt1b4wuyh/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data within fetch CreateTack", data);
        if (data.error) {
          setLoading(false);
          M.toast({
            html: data.error.message,
            classes: "#c62828 red darken-3",
          });
        } else {
          setUrl(data.url);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="card input-filed"
      style={{
        margin: "10px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={body}
        onChange={(e) => setBody(e.target.value)}
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
            placeholder="Upload your image"
          />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #546e7a blue-grey darken-1"
        onClick={() => tackDetails()}
      >
        Create
      </button>
      {loading ? <Loader /> : null}
    </div>
  );
};

export default CreateTack;
