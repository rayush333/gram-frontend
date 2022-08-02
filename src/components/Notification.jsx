import React, {useState, useEffect} from 'react';
import axios from "axios";
import "../styles/result.css";
import {BASE_API_URL} from "./constants";
import {getCookie} from "./cookies";
import { Avatar } from '@mui/material';
import {useHistory} from "react-router-dom";
function Notification({notification}) {
    let history = useHistory();
    const userToken = getCookie("token");
    const [profile, setProfile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [pageName, setPageName] = useState(null);
    useEffect(()=>{
        loadProfile();
        if(notification?.page_id)
        loadPage();
    }, []);
    function handleClick()
    {
        
        if(notification?.post_id)
        history.push(`/posts/view/${notification?.post_id}`);
        else if(notification?.page_id)
        history.push(`/pages/view/${notification?.page_id}`);
        else
        history.push(`/profile/view/${notification?.sender_id}`);
    }
    async function loadProfile()
    {
      const res = await axios.get(`${BASE_API_URL}/user/profile`,{ headers : {
        Authorization : `Bearer ${userToken}`
      }, params : {
        id : notification?.sender_id,
        type: 1
      }});
      console.log(res?.data?.data);
      const body = res?.data?.data;
      setProfile(
      {
          username : body?.username
        });
      const result = await axios.get(`${BASE_API_URL}/user/profile/pic`, { params : {
        id : notification?.sender_id
      }, headers : {
        Authorization : `Bearer ${userToken}`
      }});
      console.log(result);
      if(result?.data?.code === 200)
      {
        setProfileImage(result?.data?.data);
      }
      else
      console.log(result);
    }
    async function loadPage()
    {
        const res = await axios.get(`${BASE_API_URL}/pages`, {params: {id : notification?.page_id}, headers: {Authorization : `Bearer ${userToken}`}});
        if(res?.status == 200)
        setPageName(res?.data?.title);
    }
  return (
    <div className="result" onClick={handleClick}>{profileImage ? <Avatar src={`data:image/png;base64,${profileImage}`}/> : <Avatar />}
        <div className='result_info_container'>{notification?.type === 1 ? `@${profile?.username} tagged you in a post` : notification?.type === 2 ? `@${profile?.username} tagged you in a post of page ${pageName}` : notification?.type === 3 ? `@${profile?.username} sent you a friend request` : notification?.type === 4 ? `@${profile?.username} accepted your friend request` : notification?.type === 5 ? `@${profile?.username} invited you to follow ${pageName}` : `@${profile?.username} invited you to become an editor of page ${pageName}`}</div>
        
    </div>
  )
}

export default Notification