import axios from "axios";
import { BASE_API_URL } from "./constants";
import { getCookie } from "./cookies";
export async function loadUser()
  {
    const userToken = getCookie("token");
    const userId = getCookie("userId");
    const res = await axios.get(`${BASE_API_URL}/user/profile`,{ headers : {
      Authorization : `Bearer ${userToken}`
    }, params : {
      id : userId,
      type: 1
    }});
    console.log(res?.data?.data);
    const body = res?.data?.data;
    const result = {
        email : body?.email,
        dob : body?.dob,
        gender : body?.gender,
        userId : body?.id,
        name: body?.name,
        relationshipStatus : body?.relationship_status,
        status : body?.status,
        username : body?.username
      };
      return result;
  }