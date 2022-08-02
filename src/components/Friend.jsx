import React, {useEffect, useState} from 'react'
import "../styles/friend.css"
import { Avatar, IconButton } from '@mui/material'
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import {useHistory} from "react-router-dom";
function Friend({id, username, name, media}) {
  let history = useHistory();
  return (
    <div className="friend_container">
        <div className="friend_image_container" onClick={()=>{history.push(`/profile/view/${id}`)}}>
        {media ? <Avatar src={`data:image/png;base64,${media}`}/> : <Avatar />}
        </div>
        <div className="friend_info_container" onClick={()=>{history.push(`/profile/view/${id}`)}}>
            <h1>@{username}</h1>
            <h3>{name}</h3>
        </div>
    </div>
      )
}

export default Friend