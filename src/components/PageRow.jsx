import React from 'react'
import "../styles/friend.css"
import { Avatar } from '@mui/material'
import {useHistory} from "react-router-dom";
function Friend({id, username, name, media}) {
    let history = useHistory();
    function handleClick()
    {
        history.push(`/pages/view/${id}`);
    }
  return (
    <div className="friend_container" onClick={handleClick}>
        <div className="friend_image_container">
        {media ? <Avatar src={`data:image/png;base64,${media}`}/> : <Avatar />}
        </div>
        <div className="friend_info_container">
            <h1>{username}</h1>
            <h3>{name}</h3>
        </div>
    </div>
      )
}

export default Friend