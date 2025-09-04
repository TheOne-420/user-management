import { User } from "../validation/UserSchema";

export function getUserById(id: string) {
  try {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored).find((row) => row.id == id) : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
}
