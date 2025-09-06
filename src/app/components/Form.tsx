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

  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState<Field[]>([]);
  const [errors, setErrors] = useState<{
    [key: string]: string[] | undefined;
  }>();
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(undefined);
    const res = z.safeParse(UserSchema, formData);
    if (!res.success) {
      setErrors(z.flattenError(res.error)?.fieldErrors);
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
    <Suspense >
      {false? (
        <Loading />
      ) : (
        
        <div  className='overflow-auto dark:bg-secondary-dark'>

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
