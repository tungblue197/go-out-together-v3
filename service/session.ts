import { Session, User } from 'type';
import BaseService from './base-service';

class SessionService extends BaseService {
    constructor(){
        super();
    }

    insert = ({session, locations}: {session: Session, locations: Session[]}) => {
       return this.http.post('/api/session', { session, locations })
    }

    getById = (id?: any) => {
        return this.http.get('/api/session/' + id);
    }

    
    
}

export default new SessionService()