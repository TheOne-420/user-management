
import z from "zod";
export const UserSchema = z.object({
    
    fullName: z.string().min(3,  {error: "Fullname must have >= 3 characters"}).max(50,  {error: "Fullname must have <= 50 characters"}),
    email : z.email(),
    age: z.number().min(18, {error: "Age must be >= 18"}).max(100, {error: "Age must be <= 100"}),
    role: z.literal(["Admin", "Editor", "Viewer"], {error:"Please choose a role"}),
    bio: z.string().min(20, {error: "Bio must have >= 20 characters"}).max(300, {error: "Fullname must have <= 300 characters"})

})

export type User = z.infer<typeof UserSchema>