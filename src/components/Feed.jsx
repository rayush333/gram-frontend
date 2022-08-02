import React, {useState, useEffect} from 'react'
import "../styles/feed.css"
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Post from "./Post";
import {useHistory} from "react-router-dom";
import axios from "axios";
import { getCookie} from "./cookies";
import {BASE_API_URL} from "./constants";
import FeedPost from "./FeedPost";
function Feed() {
  const userToken = getCookie("token");
    const [feed, setFeed] = useState([]);
    let history = useHistory();
    useEffect(()=>{
      loadFeed();
    }, []);
    async function loadFeed()
    {
      const res = await axios.get(`${BASE_API_URL}/feed`, {headers : {Authorization : `Bearer ${userToken}`}});
      if(res?.status == 200)
      {
        console.log(res?.data);
        setFeed(res?.data);
        console.log(feed);
      }
    }
  return (
    <div className="feed">
        <IconButton onClick={()=>{history.push("/posts/new")}}><AddIcon /> CREATE A POST </IconButton>
        {feed?.length > 0 && feed?.map((post) => {
          return <FeedPost post = {post} />
        })}
    </div>
  )
}

export default Feed