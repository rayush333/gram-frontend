import React, {useState, useEffect} from 'react'
import "../styles/profile.css"
import "../styles/friend.css"
import "../styles/page.css"
import Avatar from '@mui/material/Avatar';
import {useHistory, useParams} from "react-router-dom";
import CountUp from 'react-countup';
import { IconButton } from '@mui/material';
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ClearIcon from '@mui/icons-material/Clear';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import WifiTetheringRoundedIcon from '@mui/icons-material/WifiTetheringRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import Post from "./Post";
import Friend from "./Friend";
import PageRow from "./PageRow";
import {useStateValue} from "./StateProvider";
import axios from 'axios';
import { BASE_API_URL } from './constants';
import {getCookie} from "./cookies";
import Admin from "./Admin";
function Page() {
  const [{user}, dispatch] = useStateValue();
  const [tab, setTab] = useState(0);
  const [type, setType] = useState(7);
  const [page, setPage] = useState(null);
  const [pagePic, setPagePic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [friends, setFriends] = useState([]);
  const userToken = getCookie("token");
  const userId = getCookie("userId");
  let history = useHistory();
  const {pageId} = useParams();
  useEffect(()=>{
    setTab(0);
    setType(7);
    loadPage();
    loadPosts();
    loadFollowers();
    getType();
    loadFriends();
  }, []);
  async function loadFriends()
  {
    const res = await axios.get(`${BASE_API_URL}/friends`, {params: {user_id : userId}, headers : {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data?.code === 200)
    setFriends(res?.data?.data);
  }
  async function getType()
  {
    const res = await axios.get(`${BASE_API_URL}/pages/relationship`, {params : {user_id : userId, page_id : pageId}, headers : {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data?.code === 200)
    setType(res?.data?.data);
  }
  async function loadFollowers()
  {
    const res = await axios.get(`${BASE_API_URL}/pages/follow`, {params : {
      page_id : pageId
    }, headers : {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.status == 200)
    setFollowers(res?.data);
  }
  async function loadPosts()
  {
    const res = await axios.get(`${BASE_API_URL}/posts`, {params: {type : 2, id : pageId}, headers : {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.status === 200)
    setPosts(res?.data);
  }
  async function handleUnfollow()
  {
    const res = await axios.post(`${BASE_API_URL}/pages/follow`, {}, {params : {page_id : pageId, role: 4}, headers: {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data?.code === 200)
    {
      window.location.reload();
      setType(7);
    }
  }
  async function handleFollow()
  {
    const res = await axios.post(`${BASE_API_URL}/pages/follow`, {}, {params : {page_id : pageId, role: 3}, headers: {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data?.code === 200)
    {
      window.location.reload();
      setType(3);
    }
  }
  async function loadPage()
  {
    const res = await axios.get(`${BASE_API_URL}/pages`, {params : {
      id : pageId
    }, headers: {
      Authorization : `Bearer ${userToken}`
    }});
    console.log(res?.data);
    if(res?.status === 200)
    {
      setPage({
        ...page,
        title : res?.data?.title,
        description : res?.data?.description,
        followers_count: res?.data?.followers_count,
        id : res?.data?.id
      });
      setPagePic(res?.data?.media);
    }
  }
  async function handleAcceptEditorRequest()
  {
    const res = await axios.put(`${BASE_API_URL}/pages/invitations`, {page_id : pageId, type : 2, status: 2}, {headers: {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data === true)
    {
      window.location.reload();
      setType(2);
    }
  }
  async function handleRejectEditorRequest()
  {
    const res = await axios.put(`${BASE_API_URL}/pages/invitations`, {page_id : pageId, type : 2, status: 3}, {headers: {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data === true)
      setType(7);
  }
  async function handleAcceptFollowRequest()
  {
    const res = await axios.put(`${BASE_API_URL}/pages/invitations`, {page_id : pageId, type : 3, status: 2}, {headers: {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data === true)
    {
      window.location.reload();
      setType(3);
    }
  }
  async function handleRejectFollowRequest()
  {
    const res = await axios.put(`${BASE_API_URL}/pages/invitations`, {page_id : pageId, type : 3, status: 3}, {headers: {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data === true)
    {
      setType(7);
    }
  }
  return (
    <div className="profile">
        {type <= 2 ? <IconButton className="create_post_button" onClick={()=>{history.push(`/posts/new/${pageId}`)}}><AddRoundedIcon /> CREATE POST </IconButton> : null}
        {type === 1 ? <IconButton className="create_post_button" onClick={()=>{history.push(`/pages/update/${pageId}`)}}><EditRoundedIcon /> EDIT PAGE </IconButton> : null}
      <div className="profile_header" style={{minHeight: "53vh"}}>
        <div className="profile_image_container">
        {pagePic ? <Avatar src={`data:image/png;base64,${pagePic}`}/> : <Avatar />}
          <div className="profile_name_container">
            <h1>{page?.title}</h1>
            <h3>{page?.description}</h3>
            <h3>{type === 5 ? "(sent you an editor request)" : type === 4 ? "(sent you a follow request)" : null}</h3>
            {type === 3 ? <div className="unfriend_button_container">
            <IconButton onClick={handleUnfollow}><PersonRemoveRoundedIcon />UNFOLLOW</IconButton>
        </div> : type === 7 ? <div className="unfriend_button_container">
            <IconButton onClick={handleFollow}><PersonAddRoundedIcon />FOLLOW</IconButton>
        </div> : type === 5 ? <div className="unfriend_button_container">
            <IconButton onClick={handleAcceptEditorRequest} style={{margin: "0 5px"}}><WifiTetheringRoundedIcon />ACCEPT</IconButton>
            <IconButton onClick={handleRejectEditorRequest} style={{margin: "0 5px"}}><ClearIcon />DECLINE</IconButton>
        </div> : type === 4 ? <div className="unfriend_button_container">
            <IconButton onClick={handleAcceptFollowRequest} style={{margin: "0 5px"}}><WifiTetheringRoundedIcon />ACCEPT</IconButton> 
            <IconButton onClick={handleRejectFollowRequest} style={{margin: "0 5px"}}><ClearIcon />DECLINE</IconButton>
        </div> : null}
          </div>
        </div>
        <div className="profile_info_container">
          <div className="profile_cards">
            <div className="profile_card" onClick={()=>{setTab(0)}}>
              <h1>POSTS</h1>
              <hr />
              <h2><CountUp end={posts?.length || 0} duration={1} /></h2>
            </div>
            <div className="profile_card" onClick={()=>{setTab(1)}}>
              <h1 style={{fontSize: "20px"}}>FOLLOWERS</h1>
              <hr />
              <h2><CountUp end={page?.followers_count || 0} duration={1} /></h2>
            </div>
            <div className="profile_card" onClick={()=>{setTab(3)}}>
              <h1>ADMIN</h1>
              <hr />
              <h2><CountUp end={1} duration={1} /></h2>
            </div>
          </div>
          <div className="profile_container_row">
            <div className="profile_info_key">
                Page Name
            </div>
            <div className="profile_info_value">
              {page?.title}
            </div>
          </div>
          <div className="profile_container_row">
            <div className="profile_info_key">
                Description
            </div>
            <div className="profile_info_value">
              {page?.description}
            </div>
          </div>
          {/* <div className="profile_container_row">
            <div className="profile_info_key">
                Created By
            </div>
            <div className="profile_info_value">
              {user?.fullName}
            </div>
          </div>
          <div className="profile_container_row">
            <div className="profile_info_key">
                Admin Email
            </div>
            <div className="profile_info_value">
              {user?.email}
            </div> */}
          {/* </div> */}
        </div>
      </div>
      {type <= 3 ?<div className="profile_tabs">
        <IconButton style={{borderBottomLeftRadius : "20px"}} className={tab  === 0 ? 'selected_button' : ''} onClick={()=>{ setTab(0)}}><InsertPhotoRoundedIcon /> POSTS</IconButton>
        <IconButton className={tab  === 1 ? 'selected_button' : ''} onClick={()=>{ setTab(1)}}><WifiTetheringRoundedIcon /> FOLLOWERS</IconButton>
        <IconButton className={tab  === 2 ? 'selected_button' : ''} onClick={()=>{ setTab(2)}}><AlternateEmailRoundedIcon /> TAGS</IconButton>
        { type === 1 ? <IconButton  style={{borderBottomRightRadius : "20px"}} className={tab  === 3 ? 'selected_button' : ''} onClick={()=>{ setTab(3)}}><PeopleAltRoundedIcon /> ADMIN</IconButton> : <IconButton style={{borderBottomRightRadius : "20px"}} disabled className={tab  === 3 ? 'selected_button' : ''} onClick={()=>{ setTab(3)}}><PeopleAltRoundedIcon /> ADMIN</IconButton>}
      </div> : null}
      {type <= 3 ? <div className="profile_body">
        {tab === 0 ? <div>
         {posts?.reverse().map((post)=>{
          return <Post post = {post} />
         })}
        </div> : tab === 3 ? type === 1 ? <div>
        {friends?.map((friend)=>
             <Admin id={friend?.id} username={friend?.username} name={friend?.name} media={friend?.media} />
          )}
        </div> : null
        : tab === 1 ? 
        <div>
          {followers?.map((follower)=>{
            return <Friend id={follower?.id} username={follower?.username} name={follower?.name} media={follower?.media} />
          })}  
        </div>
        : tab === 2 ? 
        <div>
          <PageRow username="@gameskraft" description="Organization" profile_pic="data:image/png;base64,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" />
          <PageRow username="@tenet" description="Business Unit - Backend" profile_pic="" />
          <PageRow username="@pocket52" description="Poker Game" profile_pic="data:image/jpeg;base64,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" />
          <PageRow username="@rummyculture" description="Rummy Game" profile_pic="https://play-lh.googleusercontent.com/Fk3QLcxJlEWHvaLbHsYdSK0S3n4QtJRIpwc-u_o0MuPmmsdla1Ikob-I6xshn6TARaE" />
        </div>
        : null}
      </div> : null}
    </div>
  )
}

export default Page