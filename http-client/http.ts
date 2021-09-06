import axios from "axios";
import { SERVER } from "consts/const";


const http = axios.create({
    baseURL: `${SERVER.URL}`
    
})


http.interceptors.request.use(config => {
    return config
})

http.interceptors.response.use(res => {
    if(res.data) return res.data;
    return res;
},err => {
    return Promise.reject(err)
})

export default http;