import React from 'react'
import "../styles/result.css";
import { Avatar } from '@mui/material';
import {useHistory} from "react-router-dom";
function Result({result}) {
    let history = useHistory();
    // function handleClick()
    // {
    //     if(result?.type === 1)
    //     history.push(`/profile/view/${result?.id}`);
    //     else
    //     history.push(`/pages/view/${result?.id}`);
    // }
  return (
    <div className='result'>
        {result?.media ? <Avatar src={`data:image/png;base64,${result?.media}`}/> : <Avatar />}
        <div className="result_info_container">
            <h4>{result?.type === 1 ? `@${result?.name}` : result?.name}</h4>
            <h5 style={{marginLeft: "1em", color: 'gray'}}>{result?.description}</h5>
        </div>
    </div>
  )
}

export default Result