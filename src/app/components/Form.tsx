"use client";

import React, { FormEvent, Suspense, useEffect, useState } from "react";
import userSchema from '@/app/lib/schema.json'
import addUser from "../actions/addUser";
import z from "zod";
import { UserSchema, type User } from "../validation/UserSchema";
import Loading from "./Loading";
import FormFields from "./FormFields";
import Navbar from "./Navbar";
type Field = {
  name: string;
  label: string;
  placeholder?: string;
  type: string;
  options?: string[];
};
function Form() {
  const initialFormState: User = {
    fullName: "",
    email: "",
    age: 0,
    role: "",
    bio: "",
  };
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState<Field[]>([]);
  const [errors, setErrors] = useState<{
    [key: string]: string[] | undefined;
  }>();
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(null);
    const res = z.safeParse(UserSchema, formData);
    console.log(formData)
    if (!res.success) {
      console.log("ERROR", res?.error)
      setErrors(z.flattenError(res.error)?.fieldErrors);
      console.log(formData)
    } else {
      addUser(formData);
      setFormData({});
    }
    
  }
  useEffect(() => {
     function loadFields() {
      setIsLoading(true);
      const result = userSchema;
      setFields(result?.fields);
      setIsLoading(false);
    }
    loadFields();
  }, []);
  return (
    <>
    <Navbar />
    <Suspense fallback={<p>Loading...</p>}>
      {false ? (
        <Loading />
      ) : (
        
        <div  className='overflow-auto'>

        <form
          className='overflow-auto w-screen h-screen flex   border-rounded-md '
          onSubmit={handleSubmit}
          >
          <FormFields fields={fields} formData={formData} setFormData={setFormData}  errors={errors} setErrors={setErrors}/>
        </form>
          </div>
      )}
    </Suspense>
      </>
  );
}

export default Form;
