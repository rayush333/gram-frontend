import React, {useState, useEffect} from 'react'
import "../styles/createpost.css"
import imageCompression from 'browser-image-compression';
import "../styles/photoupload.css";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import {useHistory, useParams} from "react-router-dom";
import axios from 'axios';
import { BASE_API_URL } from './constants';
import {getCookie} from "./cookies";
import Preview from "../images/preview.jpeg";
function CreatePost() {
  const [submit, setSubmit] = useState(true);
  const {pageId} = useParams(); 
  const userToken = getCookie("token");
  const userId = getCookie("userId");
    let history = useHistory();
    const [newPost, setNewPost] = useState({
      user_id : userId,
      content: "",
      loc_desc: "",
      postPic : null
    });
    useEffect(()=>{
      setSubmit(true);
    }, []);
    function handleChange(e)
    {
      const {name, value} = e.target;
      setNewPost({
        ...newPost,
        [name] : value
      });
    }
  async function handleSubmitPost()
  {
    setSubmit(false);
      var bodyFormData = new FormData();
      console.log(newPost);
      bodyFormData.append('posts', new Blob([JSON.stringify({"content" : newPost?.content,
      "loc_desc": newPost?.loc_desc, "type" : 2, "page_id" : pageId})], { type : 'application/json'}));
      if(newPost?.postPic)
      bodyFormData.append('file', newPost?.postPic);
      console.log(bodyFormData);
      axios({
          method: "post",
          url: `${BASE_API_URL}/posts`,
          data: bodyFormData,
          headers: { 'Authorization' : `Bearer ${userToken}` },
        })
          .then(function (response) {
            //handle success
            if(response?.status === 200)
            history.push(`/pages/view/${pageId}`);
          })
          .catch(function (err) {
            //handle error
            console.log(err);
          });
      }
  function showCompressed(file)
  {
    // const anchor = document.createElement("a");
    // anchor.href = URL.createObjectURL(file);
    // anchor.download = "pan";
    // document.body.appendChild(anchor);
    // anchor.click();
    // document.body.removeChild(anchor);
    setNewPost({
      ...newPost,
      postPic: file});
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
  return (
    <div className="create_post">
        <div className="create_post_input">
        <textarea name="content" rows="10" cols="120" spellcheck="false" placeholder="What's on your mind, Ayush?" onChange={handleChange}></textarea>
        </div>
        <div>
     <img src={newPost?.postPic ? URL.createObjectURL(newPost?.postPic) : Preview} className="create_post_image" alt="Upload your image here" />
     <div className="image_upload_container">
     <label for="inputTag">
        UPLOAD IMAGE
     <input id="inputTag" className="create_post_upload" type="file" accept="image/*" onChange={event => handleImageUpload(event)} />
     </label>
     </div>
     </div>
        <div className="create_post_input">
            <input name="loc_desc" type="text" spellcheck="false" placeholder="Enter your location (optional) " onChange={handleChange} />
        </div>
        <div className="create_post_input">
        <input type="text" placeholder="Tag your friends or pages (optional) " />
        </div>
        {submit ? <IconButton onClick={handleSubmitPost}><AddIcon /> CREATE POST </IconButton> : 
        <IconButton disabled><AddIcon /> CREATE POST </IconButton>}
    </div>
  )
}

export default CreatePost