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
function FeedPost({post}) {
    const userToken = getCookie("token");
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    let history = useHistory();
    useEffect(()=>{
        getLikes();
        checkLiked();
    }, []);
    async function getLikes()
    {
        setLikes(post?.likes);
    }
    async function handleSubmitLike()
    {
        if(isLiked)
        alert("Already liked");
        else
        {
            const res = await axios.post(`${BASE_API_URL}/posts/likes`, {}, {params : {id : post?.post_id}, headers: {
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
        const res = await axios.get(`${BASE_API_URL}/posts/like`, {params : {post_id : post?.post_id}, headers: {
            Authorization : `Bearer ${userToken}`
        }});
        if(res?.data?.code === 200)
        setIsLiked(res?.data?.data);
    }
    return (
    <div className='post'>
        <div className="post_top">
        {post?.display_pic_media ? <Avatar src={`data:image/png;base64,${post?.display_pic_media}`}/> : <Avatar />}
            <div className="post_topInfo">
                <h3>{post?.name}</h3>
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
            <div className="post_option" onClick={()=>{history.push(`/posts/view/${post?.post_id}`)}}>
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

export default FeedPost