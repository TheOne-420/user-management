
import  userSchema from '@/app/lib/schema.json';
import z from "zod";
import generateObjectSchema from "./index";   
const fields = userSchema?.fields
export const UserSchema = generateObjectSchema(fields);

export type User = z.infer<typeof UserSchema>