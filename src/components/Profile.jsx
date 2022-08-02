import React, {useState, useEffect} from 'react'
import "../styles/profile.css"
import "../styles/friend.css"
import Avatar from '@mui/material/Avatar';
import CountUp from 'react-countup';
import { IconButton } from '@mui/material';
import InsertPhotoRoundedIcon from '@mui/icons-material/InsertPhotoRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import Post from "./Post";
import Friend from "./Friend";
import PageRow from "./PageRow";
import {useStateValue} from "./StateProvider";
import { actionTypes } from './reducer';
import axios from "axios";
import {BASE_API_URL} from "./constants";
import { getCookie } from "./cookies";
import {useParams} from "react-router-dom";
import ClearIcon from '@mui/icons-material/Clear';
function Profile() {
  const { userId } = useParams();
  const [{user, profilePic}, dispatch] = useStateValue();
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [tab, setTab] = useState(0);
  const [type, setType] = useState(0); 
  const [posts, setPosts] = useState([]); 
  const [friends, setFriends] = useState([]);
  const [pages, setPages] = useState([]);
  const userToken = getCookie("token");
  const myId = getCookie("userId");
  useEffect(()=>{
    setTab(1);
    loadProfile();
    loadPosts();
    loadPages();
    loadFriends();
    checkProfileType();
  }, [userId]);
  async function loadPages()
  {
    const res = await axios.get(`${BASE_API_URL}/pages/user`, {params : {role : 1, user_id : userId}, headers : {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data?.code === 200)
    setPages(res?.data?.data);
  }
  async function loadFriends()
  {
    const res = await axios.get(`${BASE_API_URL}/friends`, {params: {user_id : userId}, headers : {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.data?.code === 200)
    setFriends(res?.data?.data);
  }
  async function loadPosts()
  {
    const res = await axios.get(`${BASE_API_URL}/posts`, {params: {type : 1, id : userId}, headers : {
      Authorization : `Bearer ${userToken}`
    }});
    if(res?.status === 200)
    setPosts(res?.data);
  }
  async function checkProfileType()
  {
    if(userId == myId)
    setType(0);
    else
    {
      const res = await axios.get(`${BASE_API_URL}/user/relationship`, {params : {user_id : userId}, headers: {Authorization : `Bearer ${userToken}`}});
      if(res?.data?.code === 200)
      setType(res?.data?.data);
    }
  }
  async function sendFriendRequest()
  {
    const res = await axios.post(`${BASE_API_URL}/friends/requests`, {receiver_id : userId}, {headers: {Authorization : `Bearer ${userToken}`}});
    if(res?.data?.code === 200)
    {
      setType(3);
    }
  }
  async function sendUnfriendRequest()
  {
    const res = await axios.put(`${BASE_API_URL}/friends`, {receiver_id: userId}, {headers: {Authorization : `Bearer ${userToken}`}});
    if(res?.status == 200 && res?.data)
    {
      window.location.reload();
      setType(-1);
    }
  }
  async function handleAcceptRequest()
  {
    const res = await axios.put(`${BASE_API_URL}/friends/requests`, {sender_id : userId, status : 2}, {headers: {Authorization : `Bearer ${userToken}`}});
    if(res?.data?.code === 200 && res?.data?.data === true)
    {
      window.location.reload();
      setType(1);
    }
    else
    alert("Network error");
  }   
  async function handleRejectRequest()
  {
    const res = await axios.put(`${BASE_API_URL}/friends/requests`, {sender_id : userId, status : -1}, {headers: {Authorization : `Bearer ${userToken}`}});
    if(res?.data?.code === 200 && res?.data?.data === true)
    setType(-1);
    else
    alert("Network error");
  }
  async function loadProfile()
  {
    const res = await axios.get(`${BASE_API_URL}/user/profile`,{ headers : {
      Authorization : `Bearer ${userToken}`
    }, params : {
      id : userId,
      type: 1
    }});
    console.log(res?.data?.data);
    const body = res?.data?.data;
    setProfile(
    {
        email : body?.email,
        dob : body?.dob,
        gender : body?.gender,
        userId : body?.id,
        name: body?.name,
        relationshipStatus : body?.relationship_status,
        status : body?.status,
        username : body?.username
      });
    const result = await axios.get(`${BASE_API_URL}/user/profile/pic`, { params : {
      id : userId
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
  return (
    <div className="profile">
      <div className="profile_header">
        <div className="profile_image_container">
        {profileImage ? <Avatar src={`data:image/png;base64,${profileImage}`}/> : <Avatar />}
          <div className="profile_name_container">
            <h1>@{profile?.username}</h1>
            <h3>{profile?.description}</h3>
            {type === 2 ? <h3>Sent you a friend request</h3> : null}
            {type === 1 ? <div className="unfriend_button_container">
            <IconButton onClick={sendUnfriendRequest}><PersonRemoveRoundedIcon />UNFRIEND</IconButton>
        </div> : type === -1 ? <div className="unfriend_button_container">
            <IconButton onClick={sendFriendRequest}><PersonAddRoundedIcon />ADD FRIEND</IconButton>
        </div> : type === 3 ? <div className="unfriend_button_container">
            <IconButton disabled><PersonAddRoundedIcon />REQUEST SENT</IconButton>
        </div>: type === 2 ? <div className="unfriend_button_container">
            <IconButton style={{margin: "0 5px"}} onClick={handleAcceptRequest}><PersonAddRoundedIcon />ACCEPT</IconButton>
            <IconButton style={{margin: "0 5px"}} onClick={handleRejectRequest}><ClearIcon />REJECT</IconButton>
        </div>: null}
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
              <h1>FRIENDS</h1>
              <hr />
              <h2><CountUp end={friends?.length || 0} duration={1} /></h2>
            </div>
            <div className="profile_card" onClick={()=>{setTab(2)}}>
              <h1>PAGES</h1>
              <hr />
              <h2><CountUp end={pages?.length || 0} duration={1} /></h2>
            </div>
          </div>
          <div className="profile_container_row">
            <div className="profile_info_key">
                Full Name
            </div>
            <div className="profile_info_value">
              {profile?.name || `Not Specified`}
            </div>
          </div>
          <div className="profile_container_row">
            <div className="profile_info_key">
                Date of Birth
            </div>
            <div className="profile_info_value">
              {profile?.dob?.substring(0, 10) || `Not Specified`}
            </div>
          </div>
          <div className="profile_container_row">
            <div className="profile_info_key">
                Email
            </div>
            <div className="profile_info_value">
              {profile?.email || `Not Specified`}
            </div>
          </div>
          <div className="profile_container_row">
            <div className="profile_info_key">
              Gender
            </div>
            <div className="profile_info_value">
              {profile?.gender || `Not Specified`}
            </div>
          </div>
          <div className="profile_container_row">
            <div className="profile_info_key">
              Relationship Status
            </div>
            <div className="profile_info_value">
              {profile?.relationshipStatus || `Not Specified`}
            </div>
          </div>
        </div>
      </div>
      {type === 0 || type === 1 ?<div className="profile_tabs">
        <IconButton style={{borderBottomLeftRadius : "20px"}} className={tab  === 0 ? 'selected_button' : ''} onClick={()=>{ setTab(0)}}><InsertPhotoRoundedIcon /> POSTS</IconButton>
        <IconButton className={tab  === 1 ? 'selected_button' : ''} onClick={()=>{ setTab(1)}}><GroupRoundedIcon /> FRIENDS</IconButton>
        <IconButton className={tab  === 2 ? 'selected_button' : ''} onClick={()=>{ setTab(2)}}><DescriptionRoundedIcon /> PAGES</IconButton>
        <IconButton style={{borderBottomRightRadius : "20px"}} className={tab  === 3 ? 'selected_button' : ''} onClick={()=>{ setTab(3)}}><AlternateEmailRoundedIcon /> TAGS</IconButton>
      </div> : null}
      {type === 0 || type === 1 ? <div className="profile_body">
        {tab === 0 ? <div>
         {posts?.reverse().map((post)=>{
          return <Post post={post} />
         })}
        </div> : tab === 3 ? <div>
        {user?.feed?.map((post)=>{
          return <Post post = {post} liked = {false} />
         })}
        </div>
        : tab === 1 ? 
        <div>
          {friends?.map((friend)=>{
            return <Friend id={friend?.id} username={friend?.username} name={friend?.name} media={friend?.media} />
          })}  
        </div>
        : tab === 2 ? 
        <div>
          {pages?.map((page)=>{
            return <PageRow id={page?.id} username={page?.username} name={page?.name} media={page?.media}/>
          })}  
        </div>
        : null}
      </div> : null}
    </div>
  )
}

export default Profile