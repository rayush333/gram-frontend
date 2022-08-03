import React, {useState, useEffect} from 'react'
import "../styles/createpost.css"
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import imageCompression from 'browser-image-compression';
import "../styles/photoupload.css";
import Preview from "../images/preview.jpeg";
import {useHistory} from "react-router-dom";
import {useStateValue} from "./StateProvider";
import { BASE_API_URL } from './constants';
import { getCookie } from './cookies';
function UpdateProfile() {
    let history = useHistory();
    const [{user}] = useStateValue();
    const [newUser, setNewUser] = useState(null);
    const userToken = getCookie("token");
    const userId = getCookie("userId");
    useEffect(()=>{
        setNewUser({
            ...user,
            dob: user?.dob?.substring(0,10),
            profilePic : null
        })
    }, [user]);
    function showCompressed(file)
    {
      // const anchor = document.createElement("a");
      // anchor.href = URL.createObjectURL(file);
      // anchor.download = "pan";
      // document.body.appendChild(anchor);
      // anchor.click();
      // document.body.removeChild(anchor);
      setNewUser({
        ...newUser,
        profilePic: file});
    }
    async function handleImageUpload(event) {
        
        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
        const options = {
          maxSizeMB: 1,
          alwaysKeepResolution: true,
          useWebWorker: true,
          initialQuality: 0.3
        }
        try {
          const compressedFile = await imageCompression(imageFile, options);
          console.log('compressedFile instanceof Blob', compressedFile instanceof Blob); // true
          console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
          showCompressed(compressedFile);
          //send compressedFile to server here
        } catch (error) {
          console.log(error);
        }
    }
    function handleSubmitUpdate()
    {
        // console.log(newUser);
        var bodyFormData = new FormData();
        
        console.log(newUser);
        bodyFormData.append('user', new Blob([JSON.stringify({"dob" : newUser?.dob,
        "gender": newUser?.gender,
        "name": newUser?.name,
        "relationship_status" : newUser?.relationshipStatus})], { type : 'application/json'}));
        if(newUser?.profilePic)
        bodyFormData.append('profile_pic', newUser?.profilePic, {type : 'multipart/form-data'});
        console.log(bodyFormData);
        axios({
            method: "put",
            url: `${BASE_API_URL}/user/profile`,
            data: bodyFormData,
            headers: { 'Authorization' : `Bearer ${userToken}` },
          })
            .then(function (response) {
              //handle success
              if(response?.status === 200)
              history.push(`/profile/view/${userId}`);
            })
            .catch(function (err) {
              //handle error
              console.log(err);
            });
        // if(newUser?.profilePic)
        // {
        //     res = axios.put(`${BASE_API_URL}/user/profile`, {user : JSON.stringify({
        //     "dob" : newUser?.dob,
        //     "gender": newUser?.gender,
        //     "name": newUser?.name,
        //     "relationship_status" : newUser?.relationshipStatus
        // }), profile_pic : newUser?.profilePic }, {headers: {
        //     Authorization : `Bearer ${userToken}`
        // }});
        // }
        // else
        // {
        //         res = await axios.put(`${BASE_API_URL}/user/profile`, {user : JSON.stringify({
        //         "dob" : newUser?.dob,
        //         "gender": newUser?.gender,
        //         "name": newUser?.name,
        //         "relationship_status" : newUser?.relationshipStatus
        //     })}, {headers: {
        //         Authorization : `Bearer ${userToken}`
        //     }});
        // }
        // console.log(res);
        // if(res?.data?.code === 200)
        // {
            // const body = res?.data?.data;
            // dispatch({
            //   type: actionTypes.SET_USER,
            //   user: {
            //     ...user,
            //     email : body?.email,
            //     dob : body?.dob,
            //     gender : body?.gender,
            //     userId : body?.id,
            //     name: body?.name,
            //     profilePic : body?.profile_pic,
            //     relationshipStatus : body?.relationship_status,
            //     status : body?.status,
            //     username : body?.username
            //   }
            // });
        // history.push(`/profile/view/${user?.userId}`);
        // }
        // history.push(`/profile/view/${user?.userId}`);
    }
    function handleChange(e)
    {
        const {name, value} = e.target;
        setNewUser({
            ...newUser,
            [name] : value
        });
    }
  return (
    <div className="create_post">
        {/* <div className="create_post_input">
        <textarea rows="10" cols="120" spellcheck="false" placeholder="What's on your mind, Ayush?"></textarea>
        </div> */}
        <p className='input_label'>Full Name</p>
        <div className="create_post_input">
            <input name="name" type="text" spellcheck="false" placeholder="Enter your Full Name" value={newUser?.name} onChange={handleChange}/>
        </div>
        <div>
            {newUser?.profilePic ?
            <img src={URL.createObjectURL(newUser?.profilePic)} className="create_post_image" alt="Upload your image here" /> : 
            <img src={Preview} className="create_post_image" alt="Upload your image here" />}
            <div className="image_upload_container">
                <label for="inputTag">
                    UPLOAD IMAGE
                <input id="inputTag" className="create_post_upload" type="file" accept="image/*" onChange={event => handleImageUpload(event)} />
                </label>
            </div>
        </div>
        <p className='input_label'>Username</p>
        <div className="create_post_input">
            <input name="username" type="text" spellcheck="false" placeholder="Enter your Username" value={user?.username} disabled style={{color: "gray"}}/>
        </div>
        <p className='input_label'>Email</p>
        <div className="create_post_input">
            <input name="email" type="text" spellcheck="false" placeholder="Enter your Email Id" value={user?.email} disabled style={{color: 'gray'}}/>
        </div>
        <p className='input_label'>Date of Birth</p>
        <div className="create_post_input">
            <input name="dob" type="text" spellcheck="false" placeholder="Enter your Date of Birth" value={newUser?.dob} onChange={handleChange}/>
        </div>
        <p className='input_label'>Gender</p>
        <div className="create_post_input">
            <input name="gender" type="text" spellcheck="false" placeholder="Enter your Gender" value={newUser?.gender} onChange={handleChange}/>
        </div>
        <p className='input_label'>Relationship Status</p>
        <div className="create_post_input">
            <input name="relationshipStatus" type="text" spellcheck="false" placeholder="Set your Relationship Status" value={newUser?.relationshipStatus} onChange={handleChange}/>
        </div>
        <IconButton onClick={handleSubmitUpdate}><AddIcon /> UPDATE PROFILE </IconButton>
    </div>
  )
}

export default UpdateProfile