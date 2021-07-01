import React, { useState, useEffect, useContext, Fragment } from "react";
import { UserContext } from "./../../App";
import { useParams } from "react-router-dom";
import Loader from "./../utilities/Loader";
import M from "materialize-css";

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const { userId } = useParams();
  const { state, dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  // const [showFollow, setShowFollow] = useState(true);
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userId) : true
  );

  useEffect(() => {
    // const user = localStorage.getItem("user");
    // console.log(user);
    fetch(`/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("data within the fetch UserProfile", data);
        setProfile(data);
        setLoading(false);
      });
  }, [userId]);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ followedId: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("data within followUser", data);
        if (data.message) {
          setShowFollow(false);
          return M.toast({
            html: data.message,
            classes: "#26a69a teal lighten-1 text-#ffffff",
          });
        }
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        // console.log("state within followUser", state);
        setProfile((prevState) => {
          // console.log("prevState within setProfile", prevState);
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
      body: JSON.stringify({ unfollowedId: userId }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("data within unfollowUser", data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        // console.log("state within unfollowUser", state);
        setProfile((prevState) => {
          // console.log("prevState within setProfile unfollowUser", prevState);
          const newFollowers = prevState.user.followers.filter(
            (follower) => follower !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollowers,
            },
          };
        });
        setShowFollow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderNumberOfItems = (items, nameOfItem) => {
    if (items.length > 1) {
      return (
        <h6>
          {items.length} {nameOfItem}s
        </h6>
      );
    } else if (items.length === 1) {
      return <h6>1 {nameOfItem}</h6>;
    } else {
      return <h6>0 {nameOfItem}</h6>;
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div
          style={{ maxWidth: "550px", margin: "0 auto" }}
          id="user-profile-div"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "10px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                src={profile.user.pic}
                style={{
                  height: "160px",
                  width: "160px",
                  borderRadius: "80px",
                }}
                alt="User's avatar"
              />
            </div>
            <div style={{ marginLeft: "15px" }}>
              <h4>{profile && profile.user.name}</h4>

              {/* <h4>{profile ? profile.user.name : "Loading..."}</h4> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                {profile && renderNumberOfItems(profile.posts, "post")}
                {profile &&
                  renderNumberOfItems(profile.user.followers, "follower")}
                <h6>{profile && profile.user.following.length} following</h6>
              </div>
              {showFollow ? (
                <button
                  className="btn waves-effect waves-light #546e7a blue-grey darken-1"
                  onClick={() => followUser()}
                  style={{ marginTop: "10px" }}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #546e7a blue-grey darken-1"
                  onClick={() => unfollowUser()}
                  style={{ marginTop: "10px" }}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {profile && profile.posts.length > 0 ? (
              profile.posts.map((item, i) => (
                <img
                  className="item"
                  src={item.photo}
                  key={i}
                  alt="User's Tack"
                />
              ))
            ) : (
              <h6>Let's create your first Tack!</h6>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default UserProfile;
