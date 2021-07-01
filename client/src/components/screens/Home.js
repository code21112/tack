import React, { useState, useEffect, useContext, Fragment } from "react";
import { UserContext } from "./../../App";
import M from "materialize-css";
import Loader from "./../utilities/Loader";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);
  const [comment, setComment] = useState(
    sessionStorage.getItem("comment") || ""
  );
  const [loading, setLoading] = useState(true);
  // const [showAllComments, setShowAllComments] = useState(false);

  const renderNumberOfLikes = (item) => {
    if (item.likes.length > 1) {
      return (
        <h6 style={{ marginTop: 0, marginLeft: "5px" }}>
          {item.likes.length} likes
        </h6>
      );
    } else if (item.likes.length === 1) {
      return <h6 style={{ marginTop: 0, marginLeft: "5px" }}>1 like</h6>;
    } else {
      return <h6 style={{ marginTop: 0, marginLeft: "5px" }}>0 like</h6>;
    }
  };

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((response) => response.json())
      .then((dataFromFetch) => {
        // console.log("data in likePost", data);
        const newData = data.map((item, i) => {
          if (item._id === dataFromFetch._id) {
            return dataFromFetch;
          }
          return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((response) => response.json())
      .then((dataFromFetch) => {
        // console.log("data in unlike", dataFromFetch);
        // console.log(dataFetch.likes);
        const newData = data.map((item, i) => {
          if (item._id === dataFromFetch._id) {
            // console.log("inside if statement item._id == dataFromFetch._id");
            return dataFromFetch;
          }
          // console.log("outside if statement item._id == dataFromFetch._id");
          return item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log("result within makeComment", result);
        const newData = data.map((item, i) => {
          if (item._id === result._id) {
            return result;
          }
          return item;
        });
        setComment("");
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleChange = (e) => {
  //   e.preventDefault();
  //   console.log(e.target.value);
  //   localStorage.setItem("comment", e.target.value);
  //   setComment(e.target.value);
  // };

  const deletePost = (postId) => {
    fetch(`/post/delete/${postId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);
        M.toast({
          html: result.message,
          classes: "#26a69a teal lighten-1 text-#ffffff",
        });
        const newData = data.filter((item) => {
          return item._id !== result.result._id;
        });
        setData(newData);
      })
      .catch((err) => {
        M.toast({
          html: "Oops...an error occured. Try again later.",
          classes: "#e53935 red darken-1",
        });
        console.log(err);
      });
  };

  useEffect(() => {
    fetch("/posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("result in useEffect Home", result);
        setData(result.posts);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="home">
          {data.map((item, i) => (
            <div
              className="card home-card"
              key={i}
              style={{ position: "relative" }}
            >
              <h6
                style={{
                  marginLeft: "15px",
                  paddingTop: "5px",
                  fontWeight: "500",
                }}
              >
                {/* <img src={item.postedBy.pic} /> */}
                <img
                  src={item.postedBy.pic}
                  style={{
                    height: "22px",
                    width: "22px",
                    position: "absolute",
                    top: "3px",
                    left: "3px",
                    borderRadius: "50%",
                  }}
                  alt="Avatar"
                />
                {item.postedBy._id === state._id ? (
                  <Link to="/my-profile" style={{ margin: "20px" }}>
                    {item.postedBy.name}
                  </Link>
                ) : (
                  <Link
                    to={`/profile/${item.postedBy._id}`}
                    style={{ margin: "20px" }}
                  >
                    {item.postedBy.name}
                  </Link>
                )}
                {item.postedBy._id === state._id ? (
                  <i
                    className="material-icons"
                    style={{
                      position: "absolute",
                      color: "grey",
                      cursor: "pointer",
                      // float: "right",
                      marginRight: "5px",
                      // paddingBottom: "3px",
                      marginTop: "-3px",
                      // float: "right",
                      right: "0px",
                    }}
                    onClick={() => deletePost(item._id)}
                  >
                    delete_forever
                  </i>
                ) : null}
              </h6>
              <div className="card-image">
                <img src={item.photo} alt="Tack" />
              </div>
              <div className="card-content">
                {item.likes.includes(state._id) ? (
                  <>
                    <i
                      className="material-icons"
                      style={{
                        color: "red",
                        cursor: "pointer",
                      }}
                      onClick={() => unlikePost(item._id)}
                    >
                      favorite
                    </i>
                  </>
                ) : (
                  <i
                    className="material-icons"
                    style={{
                      color: "grey",
                      cursor: "pointer",
                    }}
                    onClick={() => likePost(item._id)}
                  >
                    favorite_border
                  </i>
                )}
                {renderNumberOfLikes(item)}
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                <hr />
                {item.comments.length > 7 ? (
                  <i
                    className="material-icons"
                    style={{
                      color: "grey",
                      cursor: "pointer",
                    }}
                  >
                    unfold_more
                  </i>
                ) : null}

                {item.comments.map((comment, i) => (
                  <h6 key={i}>
                    <span style={{ fontWeight: 500 }}>
                      {comment.postedBy.name}
                    </span>
                    : {comment.text}
                  </h6>
                ))}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    // console.log(e.target[0].value);
                    makeComment(e.target[0].value, item._id);
                    e.target[0].value = "";

                    // makeComment(sessionStorage.getItem("comment"), item._id);
                    // sessionStorage.removeItem("comment");
                  }}
                  onChange={(e) => {
                    e.preventDefault();
                    sessionStorage.setItem("comment", e.target.value);
                    setComment(sessionStorage.getItem("comment"));
                  }}
                >
                  <input type="text" placeholder="Add a comment" />
                  {/* <input type="text" placeholder="Add a comment" value={comment} /> */}
                </form>
                {/* <input
              type="text"
              placeholder="Add a comment 2"
              value={text}
              onChange={(e) => handleChange(e)}
            /> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  );
};

export default Home;
