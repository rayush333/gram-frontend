import React, {useState, useEffect} from 'react';
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { BASE_API_URL } from './constants';
import { getCookie } from './cookies';
import "../styles/searchbox.css";
import "../styles/result.css";
import { Avatar } from '@mui/material';
import {useHistory} from "react-router-dom";
function SearchBox() {
  let history = useHistory();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const userToken = getCookie("token");
  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );
  useEffect(()=>{
    if(!query || query.trim() === "")
    {
      setShowResults(false);
      setResults([]);
    }
  }, [query]);
  async function handleBlur()
  {
    await delay(500);
    setShowResults(false);
  }
  async function handleChange(e)
    {
        setQuery(e.target.value);
        if(e.target.value && e.target.value.trim() !== "")
        getResults();
        else
        setResults([]);
    }
    async function getResults()
    {
      if(query && query.trim() != "" && query.trim().length >= 2)
      {
      const res = await axios.get(`${BASE_API_URL}/search`, {params : {
        query : query
      }, headers : {
        Authorization : `Bearer ${userToken}`
      }});
      if(res?.status == 200)
      {
        if(query && query.trim() != "")
        {
          setShowResults(true);
          setResults(res?.data);
        }
      }
    }
    else
    {
      setResults([]);
      setShowResults(false);
    }
    }
  return (
    <div className='header_input'>
        <SearchIcon />
        <input name="query" type = "text" placeholder='Search for friends, followers, users or pages' value={query} onChange={handleChange} spellcheck="false" autocomplete="false" onBlur={handleBlur} />
        {results?.length > 0 && showResults ? <div className="search_results">
          {results?.map((result)=>{
            return <div className='result' onClick={()=>{if(result?.type === 1) history.push(`/profile/view/${result?.id}`); else history.push(`/pages/view/${result?.id}`);setShowResults(false);setQuery("");}}>
            {result?.media ? <Avatar src={`data:image/png;base64,${result?.media}`}/> : <Avatar />}
            <div className="result_info_container">
                <h4>{result?.type === 1 ? `@${result?.name}` : result?.name}</h4>
                <h5 style={{marginLeft: "1em", color: 'gray'}}>{result?.description}</h5>
            </div>
        </div>
          })}
        </div> : null}
    </div>
  )
}

export default SearchBox