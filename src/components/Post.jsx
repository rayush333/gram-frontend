import React, {useState, useEffect} from 'react'
import "../styles/post.css"
import Avatar from '@mui/material/Avatar';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import ShareRoundedIcon from '@mui/icons-material/ShareRounded';
import axios from "axios";
import {BASE_API_URL} from "./constants";
import {getCookie} from "./cookies";
import { useHistory } from 'react-router-dom';
function Post({post}) {
    const userToken = getCookie("token");
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [profile, setProfile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    let history = useHistory();
    useEffect(()=>{
        getLikes();
        checkLiked();
        loadProfile();
    }, []);
    async function getLikes()
    {
        const res = await axios.get(`${BASE_API_URL}/posts/likes`, {params : {post_id : post?.id}, headers: {
            Authorization : `Bearer ${userToken}`
        }});
        if(res?.data?.code === 200)
        setLikes(res?.data?.data?.length);
    }
    async function handleSubmitLike()
    {
        if(isLiked)
        alert("Already liked");
        else
        {
            const res = await axios.post(`${BASE_API_URL}/posts/likes`, {}, {params : {id : post?.id}, headers: {
                Authorization: `Bearer ${userToken}`
            }});
            if(res?.status == 200)
            {
                setIsLiked(true);
                setLikes(likes+1);
            }
        }
    }
    async function checkLiked()
    {
        const res = await axios.get(`${BASE_API_URL}/posts/like`, {params : {post_id : post?.id}, headers: {
            Authorization : `Bearer ${userToken}`
        }});
        if(res?.data?.code === 200)
        setIsLiked(res?.data?.data);
    }
    async function loadProfile()
    { 
    const res = await axios.get(`${BASE_API_URL}/user/profile`,{ headers : {
      Authorization : `Bearer ${userToken}`
    }, params : {
      id : post?.user_id,
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
      id : post?.user_id
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
    <div className='post'>
        <div className="post_top">
        {profileImage ? <Avatar src={`data:image/png;base64,${profileImage}`}/> : <Avatar />}
            <div className="post_topInfo">
                <h3>{profile?.username}</h3>
                <p>{post?.loc_desc}</p>
            </div>
        </div>
        <div className="post_bottom">
            <p>{post?.content}</p>
            </div>
            {post?.post_media ? <div className="post_image">
             <img src={`data:image/png;base64,${post?.post_media}`} alt={`${post?.content}`} />
        </div> : null}
        <div className="post_options">
            {isLiked ? 
            <div className="post_option" style={{color: "#08fcbd", cursor: "default"}}>
            <ThumbUpRoundedIcon />
            <p>{likes > 0 ? likes : `Like`}</p>
        </div>
            : 
            <div className="post_option" style={{color: "black"}} onClick={handleSubmitLike}>
                <ThumbUpRoundedIcon />
                <p>{likes > 0 ? likes : `Like`}</p>
            </div>}
            <div className="post_option" onClick={()=>{history.push(`/posts/view/${post?.id}`)}}>
                <ChatBubbleRoundedIcon />
                <p>Comment</p>
            </div>
            <div className="post_option">
                <ShareRoundedIcon />
                <p>Share</p>
            </div>
        </div>
    </div>
  )
}

export default Post