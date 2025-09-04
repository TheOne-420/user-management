


import { User } from '../validation/UserSchema';
import { getUsers } from './getUsers';

function addUser(user : User) {
    const users = getUsers();
    const id = Date.now()
    users.push({id, ...user});
    localStorage.setItem("users",JSON.stringify(users))
}


export default addUser;