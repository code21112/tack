// import React from "react";

// const Profile = () => {
//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-around",
//           margin: "10px 0px",
//         }}
//         className="div_test"
//       >
//         <div>
//           <img
//             src="https://www.freepngimg.com/thumb/minecraft/70718-youtube-game-video-avatar-minecraft-drawing.png"
//             style={{
//               height: "160px",
//               width: "160px",
//               borderRadius: "80px",
//             }}
//           />
//         </div>
//         <div>
//           <h3>Name</h3>
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               width: "103%",
//             }}
//           >
//             <h6>40 posts</h6>
//             <h6>followers</h6>
//             <h6>following</h6>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

// HIS VERSION
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./../../App";
import Loader from "./../utilities/Loader";
import M from "materialize-css";

const Profile = () => {
  const [myTacks, setMyTacks] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [loadingPic, setLoadingPic] = useState(false);
  const [image, setImage] = useState("");
  // console.log("state inside Profile", state);

  useEffect(() => {
    // const user = localStorage.getItem("user");
    // console.log(user);
    fetch("/my-posts", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("data within the fetch my-posts Profile", data);
        setMyTacks(data.posts);
        // console.log("myTacks", myTacks);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (image) {
      setLoadingPic(true);
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
          // console.log("data within 2e useEffect Profile", data);
          if (data.error) {
            setLoadingPic(false);
            M.toast({
              html: data.error.message,
              classes: "#c62828 red darken-3",
            });
          } else {
            fetch("/updatepic", {
              method: "put",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
              body: JSON.stringify({ pic: data.url }),
            })
              .then((response) => response.json())
              .then((data) => {
                // console.log(
                //   "data within 2e fetch useEffect Profile ==> /updatepic",
                //   data
                // );
                localStorage.setItem(
                  "user",
                  JSON.stringify({ ...state, pic: data.pic })
                  // window.location.reload()
                );
                dispatch({ type: "UPDATEPIC", payload: data.pic });
              })
              .catch((err) => {
                console.log(err);
              });
            setLoadingPic(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

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

  const updatePic = (file) => {
    setImage(file);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div style={{ maxWidth: "550px", margin: "0 auto" }} id="profile-div">
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
                src={state.pic}
                style={{
                  height: "160px",
                  width: "160px",
                  borderRadius: "80px",
                }}
              />
              {loadingPic ? (
                <Loader />
              ) : (
                <div
                  className="file-field input-field"
                  style={{ margin: "10px" }}
                >
                  <div className="btn">
                    <span>Update</span>
                    <input
                      type="file"
                      onChange={(e) => updatePic(e.target.files[0])}
                    />
                  </div>
                  <div className="file-path-wrapper">
                    <input
                      className="file-path validate"
                      type="text"
                      placeholder="Update your pic"
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              {/* <h4>{profile ? profile.result.name : "Loading..."}</h4> */}
              {/* <h4>{state ? state.result.name : "Loading..."}</h4> */}
              <h4>{state ? state.name : "Loading..."}</h4>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                {/* <h6>{myTacks ? myTacks.length : "0"} posts</h6> */}
                {myTacks && renderNumberOfItems(myTacks, "post")}
                {/* <h6>{state ? state.result.followers.length : "0"} followers</h6> */}
                {/* {renderNumberOfItems(state.result.followers, "follower")} */}
                {renderNumberOfItems(state.followers, "follower")}
                <h6>{state ? state.following.length : "0"} following</h6>
              </div>
            </div>
          </div>
          <div className="gallery">
            {myTacks && myTacks.length > 0 ? (
              myTacks.map((item, i) => (
                <img className="item" src={item.photo} key={i} />
              ))
            ) : (
              <h6>Let's create your first Tack!</h6>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
