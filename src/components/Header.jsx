import React, {useState, useEffect} from 'react'
import "../styles/header.css"
import Image from "../images/gk-logo.png"
import SearchBox from "./SearchBox"
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import Avatar from '@mui/material/Avatar';
import {useHistory} from "react-router-dom";
// import IconButton from '@mui/material/IconButton';
import {useStateValue} from "./StateProvider";
import axios from 'axios';
import { BASE_API_URL } from './constants';
import {getCookie} from "./cookies";
import Notification from "./Notification";
function Header() {
  let history = useHistory();
  const userToken = getCookie("token");
  const [{user, profilePic}] = useStateValue();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  useEffect(()=>{
    getNotifications();
  }, []);
  async function getNotifications()
  {
    const res = await axios.get(`${BASE_API_URL}/notifications`, {headers : {Authorization : `Bearer ${userToken}`}});
    if(res?.status == 200)
      setNotifications(res?.data);
  }
  return (
    <div className="header">
        <div className="header_left">
            <img src={Image} alt="logo" />
            <SearchBox />
        </div>
        <div className="header_right">
          <div className="header_option" onClick={()=>{history.push("/")}}>
            <HomeRoundedIcon fontSize="large" />
          </div>
          <div className="header_option" onClick={()=>{setShowNotifications(!showNotifications)}}>
            <NotificationsActiveRoundedIcon fontSize="large" />
          </div>
          <div className="header_option" onClick={()=>{history.push("/posts/new")}}>
            <AddRoundedIcon fontSize="large" />
          </div>
          <div className="header_option" onClick={()=>{history.push("/pages/new")}}>
            <NoteAddRoundedIcon fontSize="large" />
          </div>
          <div className="header_info" onClick = {()=>{history.push(`/profile/view/${user?.userId}`)}}>
            {profilePic ? <Avatar src={`data:image/png;base64,${profilePic}`}/> : <Avatar />}
            <h4>@{user?.username}</h4>
          </div>
        </div>
       {showNotifications && notifications?.length > 0 ? <div className="notifications" onClick={()=>{setShowNotifications(false)}}>
          {notifications?.map((notification)=>{
            return <Notification notification = {notification} />
          })}
        </div> : null}
    </div>
  )
}
export default Header