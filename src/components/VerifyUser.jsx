import React,{useState, useEffect} from 'react'
import qs from 'qs';
import axios from "axios";
import { useHistory } from 'react-router-dom';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import "../styles/verifyuser.css";
import { BASE_API_URL } from './constants';
import Image from "../images/gk-logo.png";
import { IconButton } from '@mui/material';
function VerifyUser() {
    let history = useHistory();
    const [isVerified, setIsVerified] = useState(false);
    useEffect(()=>{
        userVerification();
    }, []);
    async function userVerification()
    {
        const params = qs.parse(window.location.search, { ignoreQueryPrefix: true });
        console.log(params?.verify_token);
        const res = await axios.get(`${BASE_API_URL}/user/email/verification`, {headers : {
            token : params?.verify_token,
            id : params?.id
        }});
        console.log(res);
        if(res?.data?.code === 200)
        setIsVerified(true);
    }
  return (
    <div>
    {isVerified ?<div className="verify_user">
        <div className="verified_container">
            <div className="verified_container_top">
            <VerifiedRoundedIcon /> <h1>USER VERIFIED</h1>
            </div>
            <div className="verified_container_middle">
                <img src={Image} alt="logo" />
            </div>
            <div className="verified_container_bottom">
                <IconButton onClick={()=>{history.replace("/login")}}>LOGIN</IconButton>
            </div>
        </div>
        </div>
         :
         <div className="verify_user" style={{backgroundImage: "linear-gradient(to right, red, white)"}}>
          <div className="verified_container" style={{boxShadow: "0 0 10px 2px red"}}>
                <div className="verified_container_top" style={{color: "red"}}>
            <CancelRoundedIcon /> <h1 style={{fontSize: '4em'}}>VERIFICATION FAILED</h1>
            </div>
            <div className="verified_container_middle">
                <img src={Image} alt="logo" />
            </div>
            <div className="verified_container_bottom">
                <IconButton onClick={()=>{history.replace("/register")}}>TRY AGAIN</IconButton>
            </div>
          </div> 
          </div> }
    </div>
  )
}

export default VerifyUser