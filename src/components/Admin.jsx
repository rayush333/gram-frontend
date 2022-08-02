import React, {useEffect, useState} from 'react'
import "../styles/friend.css"
import { Avatar, IconButton } from '@mui/material'
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import {BASE_API_URL} from "./constants";
import {getCookie} from "./cookies";
import CheckIcon from '@mui/icons-material/Check';
function Admin({id, username, name, media}) {
  const [type, setType] = useState(0);
  const {pageId} = useParams();
  const userToken = getCookie("token");
  useEffect(()=>{
    getType();
  }, []);
  async function getType()
  {
    const res = await axios.get(`${BASE_API_URL}/pages/relationship`, {params : {user_id : id, page_id : pageId}, headers : {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data?.code === 200)
    setType(res?.data?.data);
  }
  async function handleMakeEditor()
  {
    const res = await axios.post(`${BASE_API_URL}/pages/invitations`, {page_id : pageId, receiver_id : id, type: 2}, {headers: {Authorization : `Bearer ${userToken}`}});
    if(res?.status == 200 && res?.data === true)
    setType(5);
    else
    alert("Server error");
  }
  async function handleMakeFollower()
  {
    const res = await axios.post(`${BASE_API_URL}/pages/invitations`, {page_id : pageId, receiver_id : id, type: 3}, {headers: {Authorization : `Bearer ${userToken}`}});
    if(res?.status == 200 && res?.data === true)
    setType(4);
    else
    alert("Server error");
  }
  return (
    <div className="friend_container">
        <div className="friend_image_container">
        {media ? <Avatar src={`data:image/png;base64,${media}`}/> : <Avatar />}
        </div>
        <div className="friend_info_container">
            <h1>@{username}{type === 2 || type === 3 ? <span style={{position: "relative", bottom: "3px", left: "10px", padding: "2px 5px", fontSize: "0.6em", backgroundColor: type === 2 ? "green" : "brown", borderRadius: "10px", color: "white"}}>{type === 2 ? "Editor" : "Follower"}</span> : null}</h1>
            <h3>{name}</h3>
        </div>
        {type > 3 ? <div className="unfriend_button_container">
            {type === 4 ? <IconButton style={{position: "relative", right: "30px"}} disabled><CheckIcon /> FOLLOWER REQUEST SENT</IconButton> : 
            type === 5 ? <IconButton style={{position: "relative", right: "30px"}} disabled><CheckIcon /> EDITOR REQUEST SENT</IconButton> : 
            type === 7 ? <div style={{position: "relative", right: "90px", display: "flex", justifyContent: "space-between"}}><IconButton style={{position: "relative", right: "30px", marginRight: "20px"}} onClick={handleMakeEditor}><ModeEditIcon /> MAKE EDITOR</IconButton>
            <IconButton style={{position: "relative", right: "30px"}} onClick={handleMakeFollower}><WifiTetheringIcon /> MAKE FOLLOWER</IconButton></div>
            : null}
        </div> : null}
    </div>
      )
}

export default Admin