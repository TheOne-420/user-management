import { getUsers } from "./getUsers";

export function  deleteUser(id:string) {
    const users = getUsers()?.filter((v)=>v.id !== id);
    localStorage.setItem("users", JSON.stringify(users));
    return users;
}   