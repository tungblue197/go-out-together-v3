import { AxiosInstance } from "axios";
import http from "http-client/http";

class BaseService {
    public http: AxiosInstance  = http;
    constructor(){
        
    }
}

export default BaseService