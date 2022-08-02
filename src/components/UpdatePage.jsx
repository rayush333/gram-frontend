import React, {useState, useEffect} from 'react'
import "../styles/createpost.css"
import PhotoUpload from "./PhotoUpload";
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import imageCompression from 'browser-image-compression';
import "../styles/photoupload.css";
import Preview from "../images/preview.jpeg";
import {useHistory, useParams} from "react-router-dom";
import {useStateValue} from "./StateProvider";
import {actionTypes} from "./reducer";
import axios from "axios";
import {BASE_API_URL} from "./constants";
import { getCookie } from './cookies';
function UpdatePage() {
    let history = useHistory();
    const userToken = getCookie("token");
    const [{user}, dispatch] = useStateValue();
    const [newPage, setNewPage] = useState(null);
    const {pageId} = useParams();
    useEffect(()=>{
        loadPage();

    }, []);
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
        setNewPage({
          ...newPage,
          title : res?.data?.title,
          description : res?.data?.description,
          id : res?.data?.id
        });
      }
    }
    function showCompressed(file)
    {
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
    function handleSubmitUpdate()
    {
        var bodyFormData = new FormData();
        
        console.log(newPage);
        bodyFormData.append('pages', new Blob([JSON.stringify({"id" : newPage?.id,
        "description": newPage?.description,
        "title": newPage?.title})], { type : 'application/json'}));
        if(newPage?.pagePic)
        bodyFormData.append('file', newPage?.pagePic);
        console.log(bodyFormData);
        axios({
            method: "put",
            url: `${BASE_API_URL}/pages`,
            data: bodyFormData,
            headers: { 'Authorization' : `Bearer ${userToken}` },
          })
            .then(function (response) {
              //handle success
              if(response?.data?.code === 200)
              history.push(`/pages/view/${pageId}`);
            })
            .catch(function (err) {
              //handle error
              console.log(err);
            });
    }
    function handleChange(e)
    {
        const {name, value} = e.target;
        setNewPage({
            ...newPage,
            [name] : value
        });
    }
  return (
    <div className="create_post">
        {/* <div className="create_post_input">
        <textarea rows="10" cols="120" spellcheck="false" placeholder="What's on your mind, Ayush?"></textarea>
        </div> */}
        <p className='input_label'>Page Name</p>
        <div className="create_post_input">
            <input name="title" type="text" spellcheck="false" placeholder="Enter your Full Name" value={newPage?.title} onChange={handleChange}/>
        </div>
        <div>
        {newPage?.pagePic ?
            <img src={URL.createObjectURL(newPage?.pagePic)} className="create_post_image" alt="Upload your image here" /> : 
            <img src={Preview} className="create_post_image" alt="Upload your image here" />}
            <div className="image_upload_container">
                <label for="inputTag">
                    UPLOAD IMAGE
                <input id="inputTag" className="create_post_upload" type="file" accept="image/*" onChange={event => handleImageUpload(event)} />
                </label>
            </div>
        </div>
        {/* <p className='input_label'>Page Handle</p>
        <div className="create_post_input">
            <input name="username" type="text" spellcheck="false" placeholder="Enter your Username" value={user?.username} disabled style={{color: "gray"}}/>
        </div>
        <p className='input_label'>Admin Email</p>
        <div className="create_post_input">
            <input name="email" type="text" spellcheck="false" placeholder="Enter your Email Id" value={user?.email} disabled style={{color: 'gray'}}/>
        </div> */}
        <p className='input_label'>Description</p>
        <div className="create_post_input">
            <input name="description" type="text" spellcheck="false" placeholder="Tell us about yourself" value={newPage?.description} onChange={handleChange}/>
        </div>
        {/* <p className='input_label'>Date of Creation</p>
        <div className="create_post_input">
            <input name="dob" type="text" spellcheck="false" placeholder="Enter your Date of Birth" value={newPage?.dob} disabled/>
        </div>
        <p className='input_label'>Editors</p>
        <div className="create_post_input">
            <input name="gender" type="text" spellcheck="false" placeholder="Add or remove Editors" value={"@rayush333,@maheshbabu"} onChange={handleChange}/>
        </div> */}
        <IconButton onClick={handleSubmitUpdate}><AddIcon /> UPDATE PAGE </IconButton>
    </div>
  )
}

export default UpdatePage