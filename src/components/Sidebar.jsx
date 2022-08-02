import React from 'react'
import "../styles/sidebar.css"
import SidebarRow from "./SidebarRow"
import DynamicFeedRoundedIcon from '@mui/icons-material/DynamicFeedRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import {useStateValue} from "./StateProvider";
function Sidebar() {
  const [{user}] = useStateValue();
  return (
    <div className="sidebar">
        <SidebarRow title="Feed" Icon={DynamicFeedRoundedIcon} url="/" />
        <SidebarRow title="Profile" Icon={PersonRoundedIcon} url={`/profile/view/${user?.userId}`} />
        <SidebarRow title="Update Profile" Icon={ModeEditOutlineRoundedIcon} url="/profile/update" />
        <SidebarRow title="Pages" Icon={DescriptionRoundedIcon} url="/pages" />
        <SidebarRow title="Logout" Icon={ExitToAppRoundedIcon} url="/logout" />
    </div>
  )
}

export default Sidebar