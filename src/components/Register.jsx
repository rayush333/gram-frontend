import React, {useState,useEffect} from 'react';
import axios from "axios";
import Image from "../images/gameskraft-logo-black.gif";
import {useStateValue} from "./StateProvider"; 
import {useHistory} from "react-router-dom";
import "../styles/login.css";
import { BASE_API_URL } from './constants';
function Register() {
    const [{},dispatch] = useStateValue();
    let history = useHistory();
    const [details, setDetails] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm: "",
        username: ""
    });
    const [mainError, setMainError] = useState(null);
    const [errors,setErrors] = useState(null);
    useEffect(()=>{
        setDetails({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirm: "",
            username: ""
        });
        setErrors(null);
        setMainError(null);
    },[]);
    function handleChange(event){
        const {name,value} = event.target;
        setDetails({
            ...details,
            [name]: value
        });
        if(value==="")
        {
            setErrors({
                ...errors,
                [name]: "*  Required field"
            });
        }
        else
        {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    }
    async function sendUser()
    {
        setMainError("");
        if(!details?.username)
        setMainError("All fields are required");
        else
        {
        setMainError("Please wait! Registering you in our database...")
        console.log(details);
        const response = await axios.get(`${BASE_API_URL}/user/availability`, {params : {
            username: details?.username
        }});
        console.log(response);
        if(!response?.data?.data)
            setMainError(`Sorry! The username @${details?.username} is already taken...`);
        else
        {
            const res = await axios.post(`${BASE_API_URL}/user`, {
                name : `${details?.firstName} ${details?.lastName}`,
                username: details?.username,
                email : details?.email,
                password: details?.password
            });
            console.log(res);
            if(res?.data?.code === 200)
            setMainError("Welcome! Verification link sent to your email id....");
            else
            setMainError(res?.data?.data);
        }
    }
    }
    function handleSubmit(event)
    {
        if(details?.password !== details?.confirm)
        setMainError("Password and confirm password fields do not match")
        else if(errors === null || (errors.firstName === null && errors.lastName === null  && errors.email === null && errors.password === null && errors.confirm === null && errors.username === null))
            sendUser();
        else
        setMainError("Errors! Try Again...");
    }
    return (
        <div className="container">
        <div className="register-content" style={{justifyContent: "center"}}>
        <p className="title">
            Register
        </p>
        <div style={{display: "flex"}}>
        <div style={{alignItems: "left"}}>
        <p className="email">First Name</p>
        <input placeholder="Enter your first name" className="custom-email-input" type='text' style={{width: "420px", height: "50px", paddingRight: "20px"}} maxlength="150" name="firstName" onChange={handleChange} value={details.firstName} />
        <p className="email" style={{position: "relative", top: "5px", fontSize: "10px"}}>{errors?.firstName || null}</p>
        <p className="email">Last Name</p>
        <input placeholder="Enter your last name" className="custom-email-input" type='text' style={{width: "420px", height: "50px", paddingRight: "20px"}} maxlength="150" name="lastName" onChange={handleChange} value={details.lastName} />
        <p className="email" style={{position: "relative", top: "5px", fontSize: "10px", }}>{errors?.lastName || null}</p>
        {/* <p className="email">Username</p> */}
        {/* <input placeholder="Set a username" className="custom-email-input" type='text' style={{width: "420px", height: "50px", paddingRight: "20px"}} maxlength="150" name="username" onChange={handleChange} value={details.username} />
        <p className="email" style={{fontSize: "10px"}}>{errors?.username || null}</p> */}
        <p className="email">Email</p>
        <input placeholder="Enter a valid email" className="custom-email-input" type='email' style={{width: "420px", height: "50px", paddingRight: "20px"}} maxlength="150" name="email" onChange={handleChange} value={details.email} />
        <p className="email" style={{position: "relative", top: "5px", fontSize: "10px"}}>{errors?.email || null}</p>
        <button className="register-button custom-email-button" style={{color: "#08fcbd", backgroundColor: "black", cursor: "pointer", position: "relative", top: "30px"}} onClick={handleSubmit}>Register</button>
        <p className="email" style={{position: "relative", top: "35px", fontSize: "15px", }}>{mainError}</p>
        </div>
        <div style={{marginLeft: "40px"}}>
        <p className="email">Username</p>
        <input placeholder="Create your username" className="custom-email-input" type='text' style={{width: "420px", height: "50px", paddingRight: "20px"}} maxlength="150" name="username" onChange={handleChange} value={details.username} />
        <p className="email" style={{position: "relative", top: "5px", fontSize: "10px"}}>{errors?.username || null}</p>
        <p className="email">Password</p>
        <input placeholder="Must contain Uppercase letters, digits and special symbols" className="custom-email-input" type='password' style={{width: "420px", height: "50px", paddingRight: "20px"}} maxlength="150" name="password" onChange={handleChange} value={details.password} />
        <p className="email" style={{position: "relative", top: "5px", fontSize: "10px"}}>{errors?.password || null}</p>
        <p className="email">Confirm Password</p>
        <input placeholder="Re-enter your password" className="custom-email-input" type='password' style={{width: "420px", height: "50px", paddingRight: "20px"}} maxlength="250" name="confirm" onChange={handleChange} value={details.confirm} />
        <p className="email" style={{position: "relative", top: "5px", fontSize: "10px"}}>{errors?.confirm || null}</p>
        {/* <p className="email">Display Name</p>
        <input placeholder="Choose your display name" className="custom-email-input" type='text' style={{width: "420px", height: "50px", paddingRight: "20px"}} maxlength="150" name="display_name" onChange={handleChange} value={details.display_name} />
        <p className="email" style={{fontSize: "10px"}}>{errors?.display_name || null}</p> */}
        
        </div>
        </div>
        </div>
        <div className="img">
			<img src={Image} alt="image" className="login-image" style={{right: "250px"}}/>
		</div>
        </div>
    )
}

export default Register;
