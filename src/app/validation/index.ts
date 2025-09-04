import z from "zod";

const generateZodSchema = (field) => {
  let schema: z.ZodTypeAny;

  switch (field.type) {
    case "text":
    case "textarea":
      schema = z.string("This field is required");
      if (field?.format === "date-time") schema = z.datetime();
      if (field?.validation?.minLength !== undefined)
        schema = schema?.min(field.validation?.minLength, `Min characters required: ${field.validation?.minLength}`); 
      if (field?.validation?.maxLength !== undefined)
        schema = schema.max(field.validation?.maxLength, `Max characters: ${field.validation?.maxLength}`); 
      if (field?.validation?.pattern)
        schema = schema.regex(new RegExp(field.validation?.pattern)); 
      break;
    case "email":
      schema = z.email("Email is required"); 
      break;
     case "number":
    case "integer":
      let baseSchema: z.ZodNumber = field.type === "integer" 
        ? z.number("This field is required").int() 
        : z.number("This field is required");
      

      if (field?.validation?.min !== undefined) {
        baseSchema = baseSchema.min(field.validation.min, `Min number: ${field.validation.min}`);
      }
      if (field?.validation?.max !== undefined) {
        baseSchema = baseSchema.max(field.validation.max, `Max number: ${field.validation.max}`);
      }
      
      schema = baseSchema;
      break;
    case "select":
      if (!field.options || field.options.length === 0) {
        throw new Error("Select field must have options.");
      }
      schema = z.enum(field.options as [string, ...string[]], "Please choose an option");
      break;
    default:
      schema = z.any();
  }

  

  return schema;
};

export default function generateObjectSchema(fields) {
  const schemaObj: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    schemaObj[field.name] = generateZodSchema(field);
  });

  return z.object(schemaObj);
}
