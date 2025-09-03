

import { User } from '../validation/schema';
import { getUsers } from './getUsers';

function addUser(user : User) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("users",JSON.stringify(users))
}


export default addUser;