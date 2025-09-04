"use client";

import React, { FormEvent, Suspense, useEffect, useState } from "react";
import addUser from "../actions/addUser";
import z from "zod";
import { UserSchema, type User } from "../validation/UserSchema";
import Loading from "./Loading";
import FormFields from "./FormFields";
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
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState<Field[]>([]);
  const [errors, setErrors] = useState<{
    [key: string]: string[] | undefined;
  }>();
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = z.safeParse(UserSchema, formData);

    if (!res.success) {
      console.log(formData);
      setErrors(z.flattenError(res.error)?.fieldErrors);
    } else {
      setErrors(undefined);
      addUser(formData);
    }
    setFormData(initialFormState);
  }
  useEffect(() => {
    async function loadFields() {
      setIsLoading(true);
      const response = await fetch("/schema.json");
      const result = await response.json();

      setFields(result?.fields);
      setIsLoading(false);
    }
    loadFields();
  }, []);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {false ? (
        <Loading />
      ) : (
        <form
          className=' w-screen h-screen flex   border-rounded-md '
          onSubmit={handleSubmit}
        >
          <FormFields fields={fields} formData={formData} setFormData={setFormData}  errors={errors} setErrors={setErrors}/>
        </form>
      )}
    </Suspense>
  );
}

export default Form;
