import React,{useEffect} from 'react';
import "../styles/app.css";
import Login from "./Login";
import Register from "./Register";
import MainPage from "./MainPage";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {useStateValue} from "./StateProvider";
function App() {
  const [{user}, {}] = useStateValue();
  return (
    <div className="app">
            <Router>
            {user ? 
            <Switch>
            <Route path="/">
                <MainPage />
            </Route>
            </Switch>
             : 
            <Switch>
            <Route exact path="/login">
            <Login />
            </Route>
            <Route exact path="/register">
                <Register />
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
