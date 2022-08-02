import React from 'react'
import "../styles/sidebarrow.css"
import {useHistory} from "react-router-dom"
import {removeCookie} from "./cookies";
import {useStateValue} from "./StateProvider";
import {actionTypes} from "./reducer";
function SidebarRow({Icon, title, url}) {
    const [{user, profilePic}, dispatch] = useStateValue(); 
    let history = useHistory();
    function handleClick()
    {
      if(url === "/logout")
      {
        removeCookie("token");
        removeCookie("userId");
        dispatch({
          type: actionTypes.SET_USER,
          user: null
        });
        dispatch({
          type : actionTypes.SET_PROFILE_PIC,
          profilePic: null
        });
        history.push("/login");
        window.location.reload();
        return;
      }
      else
      history.push(url);
    }
  return (
    <div className="sidebar_row" onClick={handleClick}>
        {Icon && <Icon />}
        <h4>{title}</h4>
    </div>
  )
}

export default SidebarRow