"use client";

import React, { FormEvent, Suspense, useEffect, useState } from "react";
import addUser from "../actions/addUser";
import z from "zod";
import { UserSchema, type User } from "../validation/UserSchema";
import Loading from "./Loading";
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
      console.log(formData)
      setErrors(z.flattenError(res.error)?.fieldErrors );
    }
    else{
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
    
   {false ? <Loading/> :  <form
    className=' w-screen h-screen flex   border-rounded-md '
    onSubmit={handleSubmit}
    >
      <div className='  text-black m-auto w-[70%] flex flex-col p-4  place-content-center border-neutral border-2 rounded-md'>
        {fields?.map((field, idx) => {
          const { name, label, placeholder, type, options } = field;
          switch (type) {
            case "select":
              return (
                <>
                  <label key={`label${name}${idx}`} htmlFor={name}>{label}</label>
                  <select name={name} id={name} className='overflow-ellipsis border-secondary rounded-md border-2 px-2   placeholder:text-accent '
                  onChange={(e) => {
                      let newValue: string | number = e.target.value;
                      if (!isNaN(Number(newValue))) {
                          newValue = Number(newValue);
                      }
                      setFormData((prev: User) => ({
                        ...prev,
                        [name]: newValue,
                      }));
                    }}
                  >
                    <option value="" className="text-black">Choose a role</option>
                    {options?.map((option: string, i: number) => {
                      return (
                        <option className='overflow-ellipsis border-neutral rounded-md border-2 px-2 text-black' key={i} value={option}>
                          {option}
                        </option>
                      );
                    })}
                  </select>
                    {  errors && errors[name] && <p className='text-red-500 font-bold '>{errors[name][0]}</p> }
                  <br />
                </>
              );

            default:
              return (
                <>
                  <label key={`label${name}${idx}`} htmlFor={name}>
                    {label}
                  </label>
                  <input
                     key={`input${name}${idx}`}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    className='overflow-ellipsi rounded-md border-2 border-black px-2   '
                    value={formData[name as keyof User]}
                    onChange={(e) => {
                      let newValue: string | number = e.target.value;
                      if (!isNaN(Number(newValue))) {
                          newValue = Number(newValue);
                      }
                      setFormData((prev: User) => ({
                        ...prev,
                        [name]: newValue,
                      }));
                    }}
                  />
                  {
                    errors && errors[name] && <p className='text-red-500  font-bold'>{errors[name][0]}</p> }
                  <br />
                </>
              );
          }
        })}
        <button type='submit' className="bg-primary rounded-md text-accent">Submit</button>
      </div>
    </form> }
    </Suspense>
  );
}

export default Form;

