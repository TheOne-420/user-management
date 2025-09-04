import { User } from "../validation/UserSchema";

export function  updateUsers(updateUsers:User[]) {
    localStorage.setItem("users", JSON.stringify(updateUsers));
}   