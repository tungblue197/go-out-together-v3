import { User } from 'type';
import BaseService from './base-service';


class UserService extends BaseService {
    constructor(){
        super();
    }

    insert = (user: User) => {
        return this.http.post('/api/user', user);
    }

    update = ({ user, location } : any) => {
        console.log('user , ', user, 'location ', location)
        if(location) delete location.marker
        return this.http.put('/api/user/' + user.id, { location, user})
    }

    getUserLocation = (id: string) => {
        return this.http.get('/api/user/getLocationByUserId/' + id)
    } 

    getUserById = (id: string) => {
        return this.http.get('/api/user/' + id)
    }
}

export default new UserService()