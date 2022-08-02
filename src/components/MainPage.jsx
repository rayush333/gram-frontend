import React, {useState, useEffect} from 'react'
import "../styles/mainpage.css";
import { useStateValue } from './StateProvider';
import { actionTypes } from './reducer';
import Header from "./Header";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import CreatePost from "./CreatePost";
import CreatePage from "./CreatePage";
import Profile from "./Profile";
import Page from "./Page";
import CreatePagePost from "./CreatePagePost"
import {Route, Switch, Redirect} from "react-router-dom";
import UpdateProfile from "./UpdateProfile";
import UpdatePage from "./UpdatePage";
import ViewPost from './ViewPost';
import axios from "axios";
import { BASE_API_URL } from './constants';
import { getCookie } from './cookies';
function MainPage() {
  const [{user}, dispatch] = useStateValue();
  const userToken = getCookie("token");
  const userId = getCookie("userId");
  useEffect(()=>{
    loadUser();
    // sendRequest();
  }, []);
  async function loadUser()
  {
    const res = await axios.get(`${BASE_API_URL}/user/profile`,{ headers : {
      Authorization : `Bearer ${userToken}`
    }, params : {
      id : userId,
      type: 1
    }});
    console.log(res?.data?.data);
    const body = res?.data?.data;
    dispatch({
      type: actionTypes.SET_USER,
      user: {
        ...user,
        email : body?.email,
        dob : body?.dob,
        gender : body?.gender,
        userId : body?.id,
        name: body?.name,
        relationshipStatus : body?.relationship_status,
        status : body?.status,
        username : body?.username
      }
    });
    const result = await axios.get(`${BASE_API_URL}/user/profile/pic`, { params : {
      id : userId
    }, headers : {
      Authorization : `Bearer ${userToken}`
    }});
    console.log(result);
    if(result?.data?.code === 200)
    {
      dispatch({
        type : actionTypes.SET_PROFILE_PIC,
        profilePic: result?.data?.data
      });
    }
    else
    console.log(result);
  }
  // async function sendRequest()
  // {
  //   const res = axios.post(`${BASE_API_URL}/post`, {
  //     "user_id": userId,
  //     "content": "This is a sample text",
  //     "media": "1",
  //     "loc_desc": "karnataka",
  //     "type": 0,
  //     "page_id": null
  // }, {headers : {
  //   Authorization : userToken
  // }});
  // console.log(res);
  // }
  return (
    <div className="main_page">
    <Header />
    <div className="app_body">
      <Sidebar />
      <Switch>
        <Route exact path="/">
          <Feed />
        </Route>
        <Route exact path="/profile/update">
          <UpdateProfile />
        </Route>
        <Route exact path="/profile/view/:userId">
          <Profile />
        </Route>
        <Route exact path="/pages">
          <div>Pages</div>
        </Route>
        <Route exact path="/posts">
          <div>Posts</div>
        </Route>
        <Route exact path="/posts/new">
          <CreatePost />
        </Route>
        <Route exact path="/posts/view/:postId">
          <ViewPost />
        </Route>
        <Route exact path="/posts/new/:pageId">
          <CreatePagePost />
        </Route>
        <Route exact path="/pages/update/:pageId">
          <UpdatePage />
        </Route>
        <Route exact path="/pages/view/:pageId">
          <Page />
        </Route>
        <Route exact path="/pages/new">
          <CreatePage />
        </Route>
        <Route path="/">
          <Redirect exact to="/" />
        </Route>
      </Switch>
    </div>
    </div>
  )
}

export default MainPage