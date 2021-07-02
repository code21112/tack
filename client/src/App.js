import { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Profile from "./components/screens/Profile";
import UserProfile from "./components/screens/UserProfile";
import Signup from "./components/screens/Signup";
import CreateTack from "./components/screens/CreateTack";
import FollowedPosts from "./components/screens/FollowedPosts";
import ForgotPassword from "./components/screens/ForgotPassword";
import ResetPassword from "./components/screens/ResetPassword";
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith("/resetpassword"))
        history.push("/login");
    }
  }, [dispatch, history]);

  return (
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/my-profile" component={Profile} />
      <Route path="/profile/:userId" component={UserProfile} />
      <Route path="/tack/create" component={CreateTack} />
      <Route path="/my-followed-posts" component={FollowedPosts} />
      <Route path="/forgotpassword" component={ForgotPassword} />
      <Route path="/resetpassword/:resetToken" component={ResetPassword} />
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
        <Footer />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
