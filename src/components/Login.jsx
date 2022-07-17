import React,{useState} from 'react';
// import axios from "axios";
import {useHistory} from "react-router-dom";
import {useStateValue} from "./StateProvider";
import Image from "../images/gameskraft-logo-black.gif";
// import qs from "qs";
import "../styles/login.css";
function Login() 
{
    // const [{},dispatch] = useStateValue();
    const history = useHistory();
    const [state,setState] = useState(0);
    const [value,setValue] = useState("");
    const [error,setError] = useState({
        value: 0,
        message: ""
    });
    const [loginDetails, setLoginDetails] = useState({
        email: "",
        password: ""
    });
    function handleChange(event){
        setValue(event.target.value);
    }
    async function handleClick()
    {
        if(state === 0)
        {
            setLoginDetails({
                email: value,
                password: ""
            });
            setValue("");
            setState(1);
        }
        else
        {
            setLoginDetails((prev)=>{
                return {
                ...prev,
                password: value
                }
            });
        }
    }
            const details = {
                ...loginDetails,
                password: value
            };
            console.log(details);
    //         axios({
    //             method: 'post',
    //             url: 'http://localhost:5000/login',
    //             data: qs.stringify(details),
    //             headers: {'content-type': 'application/x-www-form-urlencoded'}
    //         })
    //         .then((res)=>{
    //             if(res.status === 200)
    //             {
    //                 dispatch({
    //                     type: 'SET_USER',
    //                     user: res.data.user
    //                 });
    //                 sessionStorage.setItem('user', JSON.stringify(res.data.user));
    //                 sessionStorage.setItem('token', 'Bearer ' + res.data.token);
    //                 history.replace("/");
    //             }
    //         })
    //         .catch((err)=>{
    //                 if(err)
    //                 {
    //                 seterror({
    //                     value: 1,
    //                     message: "Incorrect email or password"
    //                 });
    //                 setvalue("");
    //                 setstate(0);
    //             }
    //         });
            
    //     }
    return (
        <div>
            <div className="container">
		<div className="login-content">
				<p className="title" style={{fontSize: "60px"}}>Sign in</p>
				<p className="email">{state === 0 ? "Enter your registered email" : "Enter your password"}</p> 
				<div className="custom">
					<input type={state === 0 ? "email" : "password"} value={value} onChange={handleChange} className="custom-email-input" placeholder={state === 0 ? "Your email" : "Password"} />
					{state === 0 ? <button className="custom-email-button" onClick={handleClick}>Next</button>  :
					<button className="custom-email-button" onClick={handleClick}>Submit</button> }
				</div>
                <div>{error.value === 1 ? <p className="login-email email" style={{position: "absolute", left: "40px"}}>{error.message}</p> : null}</div>
                <p className="email message" onClick={()=>{
                    history.push("/register");
                }}>Create a new account?</p>
                {/* <div>
                <p className="login-title title">or</p>
                <button className="login-button loginBtn loginBtn--google">Sign In with Google</button>
                </div> */}
		</div>
		<div className="img">
			<img src={Image} alt="gk" className="login-image" />
		</div>
    </div>
        </div>
    )
}
export default Login;