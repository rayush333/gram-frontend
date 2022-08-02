import React, {useState} from "react";
import imageCompression from 'browser-image-compression';
import "../styles/photoupload.css";
import Preview from "../images/preview.jpeg";
// import Compressor from 'compressorjs';
export default function PhotoUpload({pic}) {
    const [image, setImage] = useState();
    function showCompressed(file)
    {
      // const anchor = document.createElement("a");
      // anchor.href = URL.createObjectURL(file);
      // anchor.download = "pan";
      // document.body.appendChild(anchor);
      // anchor.click();
      // document.body.removeChild(anchor);
      setImage(URL.createObjectURL(file));
    }
    async function handleImageUpload(event) {
        
        const imageFile = event.target.files[0];
        console.log('originalFile instanceof Blob', imageFile instanceof Blob); // true
        console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);
        const options = {
          maxSizeMB: 5,
          alwaysKeepResolution: true,
          useWebWorker: true,
          initialQuality: 0.3, 
          maxIteration: 1
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
    <>
     <div>
     <img src={image || pic || Preview} className="create_post_image" alt="Upload your image here" />
     <div className="image_upload_container">
     <label for="inputTag">
        UPLOAD IMAGE
     <input id="inputTag" className="create_post_upload" type="file" accept="image/*" onChange={event => handleImageUpload(event)} />
     </label>
     </div>
     </div>
    </>
  );
}