import { User } from 'type';
import BaseService from './base-service';


class AuthService extends BaseService {
    constructor(){
        super();
    }

    register = (user: User) => {
       return this.http.post('/auth/register', user)
    }

    login = (user: User) => {
        return this.http.post('/auth/login', user)
    }
}

export default new AuthService()