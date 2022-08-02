import { Avatar } from '@mui/material'
import React, {useState, useEffect} from 'react'
import "../styles/comment.css"
import axios from "axios";
import { getCookie } from "./cookies";
import { BASE_API_URL } from './constants';
function Comment({parentId, senderId, timestamp, text}) {
    const userToken = getCookie("token");
    const [profile, setProfile] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    useEffect(()=>{
        loadProfile();
    }, []);
    async function loadProfile()
    {
      const res = await axios.get(`${BASE_API_URL}/user/profile`,{ headers : {
        Authorization : `Bearer ${userToken}`
      }, params : {
        id : senderId,
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
        id : senderId
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
    <div className="comment" style={{marginLeft : parentId ? "2em" : "0"}}>
        <div className="comment_image">
        {profileImage ? <Avatar src={`data:image/png;base64,${profileImage}`}/> : <Avatar />}
        </div>
        <div className="comment_box">
            <div className="comment_name">
                <h2>@{profile?.username}</h2>
            </div>
            {/* <div className="comment_timestamp">
                <h4>{timestamp}</h4>
            </div> */}
            <div className="comment_text">
                <h3>{text}</h3>
            </div>
        </div>
    </div>
  )
}

export default Comment