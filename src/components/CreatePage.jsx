import React, {useState} from 'react';
import "../styles/createpost.css";
import "../styles/photoupload.css";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import {useHistory} from "react-router-dom";
import imageCompression from 'browser-image-compression';
import { getCookie } from './cookies';
import Preview from "../images/preview.jpeg";
import axios from "axios";
import { BASE_API_URL } from './constants';
const userToken = getCookie("token");
function CreatePage() {
    const [newPage, setNewPage] = useState({
        title: "",
        description: ""
    });
    let history = useHistory();
    async function handleSubmitPage()
    {
        var bodyFormData = new FormData();
        console.log(newPage);
        bodyFormData.append('pages', new Blob([JSON.stringify({"title" : newPage?.title,
        "description": newPage?.description})], { type : 'application/json'}));
        if(newPage?.pagePic)
        bodyFormData.append('file', newPage?.pagePic);
        console.log(bodyFormData);
        axios({
            method: "post",
            url: `${BASE_API_URL}/pages`,
            data: bodyFormData,
            headers: { 'Authorization' : `Bearer ${userToken}` },
          })
            .then(function (response) {
              //handle success
              if(response?.status === 200)
              history.push(`/pages/view/${'7'}`);
            })
            .catch(function (err) {
              //handle error
              console.log(err);
            });
      }
    async function checkPageNameAvailability()
    {
        const res = await axios.get(`${BASE_API_URL}/pages/availability`, {params : {pageName: newPage?.title},
    headers: {Authorization: `Bearer ${userToken}`}});
    if(res?.data?.data)
    handleSubmitPage();
    else
    alert("Page with given name already exists! Try Again...")
    }
    function handleChange(e)
    {
        const {name, value} = e.target;
        setNewPage({
            ...newPage,
            [name] : value
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
      setNewPage({
        ...newPage,
        pagePic: file});
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
            <input name="title" type="text" spellcheck="false" placeholder="What would like to name your page?" onChange={handleChange} />
        </div>
        <div className="create_post_input">
        <textarea name="description" rows="10" cols="120" spellcheck="false" placeholder="Tell us briefly what it is about..." onChange={handleChange}></textarea>
        </div>
        <div>
     {newPage?.pagePic ? <img src={URL.createObjectURL(newPage?.pagePic)} className="create_post_image" alt="Upload your image here" /> : 
     <img src={Preview} className="create_post_image" alt="Upload your image here" />}
     <div className="image_upload_container">
     <label for="inputTag">
        UPLOAD IMAGE
     <input id="inputTag" className="create_post_upload" type="file" accept="image/*" onChange={event => handleImageUpload(event)} />
     </label>
     </div>
     </div>
        <div className="create_post_input">
            <input type="text" spellcheck="false" placeholder="Add editors to your page" />
        </div>
        {/* <div className="create_post_input">
        <input type="text" placeholder="Tag your friends or pages (optional) " />
        </div> */}
        <IconButton onClick={checkPageNameAvailability}><AddIcon /> CREATE PAGE </IconButton>
    </div>
  )
}

export default CreatePage