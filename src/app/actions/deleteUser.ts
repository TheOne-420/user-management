import { getUsers } from "./getUsers";

export function  deleteUser(id:string) {
    const users = getUsers()?.filter((v)=>v.id !== id);
    localStorage.setItem("users", users);
    return users;
}   