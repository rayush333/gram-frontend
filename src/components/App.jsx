import React,{useEffect} from 'react';
import "../styles/app.css";
import Login from "./Login";
import Register from "./Register";
import VerifyUser from "./VerifyUser";
import MainPage from "./MainPage";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {useStateValue} from "./StateProvider";
import {getCookie} from "./cookies";
import {actionTypes} from "./reducer";
import axios from "axios";
import {BASE_API_URL} from "./constants";
function App() {
  const [{user}, dispatch] = useStateValue();
  const userToken = getCookie("token");
  const userId = getCookie("userId");
  useEffect(()=>{
    if(!user)
    {
    if(userToken && userId)
    {
      dispatch({
        type: actionTypes.SET_USER,
        user: {
          ...user,
          userToken : userToken,
          userId : userId
        }
      });
    }
    }
    }, []);
  return (
    <div className="app">
            <Router>
            {userToken ? 
            <MainPage />
             : 
            <Switch>
            <Route exact path="/login">
            <Login />
            </Route>
            <Route exact path="/register">
                <Register />
            </Route>
            <Route path="//user/verify">
              <VerifyUser />
            </Route>
            <Route path="/">
            <Redirect exact to="/login" />
            </Route>
            </Switch>
            }
            </Router>
            </div>
  );
}

export default App;
