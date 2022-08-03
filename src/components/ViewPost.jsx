import React, { useState, useEffect } from 'react'
import Picker from "emoji-picker-react";
import "../styles/feed.css"
import "../styles/viewpost.css"
import {IconButton, Fab} from '@mui/material';
import ModeEditOutlineRoundedIcon from '@mui/icons-material/ModeEditOutlineRounded';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import SendIcon from '@mui/icons-material/Send';
import Post from "./Post";
import Comment from './Comment';
import SearchBox from "./SearchBox";
import {useHistory, useParams} from "react-router-dom";
import {useStateValue} from "./StateProvider";
import axios from 'axios';
import { BASE_API_URL } from './constants';
import {getCookie} from "./cookies";
import Friend from './Friend';
import "../styles/profile.css";
function Feed() {
    const userToken = getCookie("token");
    const userId = getCookie("userId");
    const {postId} = useParams();
    const [ {user} ] = useStateValue();
    const [showEmoji, setShowEmoji] = useState(false);
    const [tags, setTags] = useState(null);
    const [newComment, setNewComment] = useState({
        senderId : userId,
        parentId: null,
        text : ""
    });
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState({});
    let history = useHistory();
    useEffect(()=>{
        loadPost();
        loadComments();
        loadTags();
    }, [postId]);
    async function loadTags()
    {
        const res = await axios.get(`${BASE_API_URL}/posts/tags`, {params: {post_id : postId}, headers: {Authorization : `Bearer ${userToken}`}});
        console.log(res?.data);
        if(res?.status == 200)
        {
            setTags(res?.data);
        }
    }
    async function loadComments()
    {
        const res = await axios.get(`${BASE_API_URL}/posts/comments`, {params : {id : postId}, headers: { Authorization: `Bearer ${userToken}`}});
        if(res?.status == 200)
        {
            console.log("comemnts", res);
            setComments(res?.data);
            console.log(comments);
        }
    }
    async function loadPost()
    {
        const res = await axios.get(`${BASE_API_URL}/posts/id`, {params : {post_id : postId}, headers: {
            Authorization : `Bearer ${userToken}`
        }});
        if(res?.status == 200)
        setPost(res?.data);
    }
    async function submitComment()
    {
        const res = await axios.post(`${BASE_API_URL}/posts/comments`, {post_id : postId, parent_id : newComment?.parentId, description: newComment?.text}, {headers : {Authorization : `Bearer ${userToken}`}});
        if(res?.status == 200)
        {
            window.location.reload();
        }
    }
    function handleSubmit(e){
        e.preventDefault();
        console.log(newComment);
        if(newComment.text)
        {
            submitComment();
        }
        setNewComment({
            senderId : user?.userId,
            parentId: null,
            text: ""
        });
    }
    function handleChange(e)
    {
        const {name, value} = e.target;
        setNewComment({
            ...newComment,
            [name]  : value
        });
    }
    function handleEmojiClick(e,emojiobject){
        const text= newComment?.text || "";
        setNewComment({
            
                newComment,
                text: text+emojiobject.emoji,
                time: new Date().toLocaleDateString()
            }
        );
    }
  return (
    <div className="feed">
        {/* <IconButton onClick={()=>{history.push(`/posts/update/${postId}`)}}><ModeEditOutlineRoundedIcon /> EDIT POST </IconButton> */}
        {post ? <Post post={post} /> : null}
        {Object.keys(comments).length > 0 ?
        <div className="comment_container">
            { Object.keys(comments).length > 0 && Object.keys(comments).map((key, index)=>(
                    <div>
                    {comments[key].map((comment)=>(
                        <Comment parentId = {comment?.parent_id} senderId={comment?.user_id} text={comment?.description}/>
                    ))}
                    <p style={{position: "relative", left: "3.5em", bottom: "5px", color: "#08fcbd", cursor: "pointer"}} onClick={()=>{setNewComment({...newComment, parentId : key})}}>reply in thread</p>
                    </div>
                ))
            }

            {/* {comments && Object?.keys(comments)?.map((key, index) => {
                comments[key]?.map((comment)=>{
                    return <Comment senderId = {comment?.user_id} text = {comment?.description} />
                })
            })} */}
        </div> : null}
        {newComment?.parentId ? <p style={{marginLeft: "70px", marginRight: "auto", cursor: "pointer", color: "#08fcbd"}} onClick={()=>{setNewComment({...newComment, parentId: null})}}>replying......</p> : null}
        <div className="comment_footer">
            <IconButton className="emoji_button" onClick={()=>{setShowEmoji(!showEmoji)}}><InsertEmoticonIcon style={{margin: "0px"}}/></IconButton>
            {showEmoji?<div className='emoji_picker'><Picker onEmojiClick={handleEmojiClick} /></div>:null}
            <form onSubmit={handleSubmit} className="comment_footer_form"> 
                <input type="text" placeholder="Type a comment" name="text" value={newComment?.text} onChange={handleChange} onClick={()=>{setShowEmoji(false)}} autoComplete="off" spellCheck="false" />
                <IconButton className="emoji_button" type="submit" onClick={()=>{setShowEmoji(false)}} style={{position: "relative", bottom: "5px", left: "10px"}}><SendIcon onClick={handleSubmit} /></IconButton>
            </form>
        </div>
        <h1 style={{marginRight: "auto", fontWeight: "normal", marginTop: "20px", marginBottom: "20px"}}>Tags</h1>
        <div className="profile_body">
        <div>
            {tags?.map((tag)=>{
                return <Friend id={tag?.id} username={tag?.username} name={tag?.name} media={tag?.media} />
            })}
        </div>
        </div>
    </div>
  )
}

export default Feed