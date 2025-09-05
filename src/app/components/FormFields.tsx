import React, { useState } from "react";
import { User } from "../validation/UserSchema";

function FormFields({errors, setErrors, formData,setFormData,fields}) {
 
  const [isLoading, setIsLoading] = useState(true);
 

  return (
    <div className=' bg-primary   text-secondary dark:bg-secondary-dark dark:text-accent-dark m-auto w-[70%] flex flex-col p-4  place-content-center border-neutral border-2 rounded-md'>
      {fields?.map((field, idx) => {
        const { name, label, placeholder, type, options } = field;
        switch (type) {
          case "textarea":
            return (
              <>
                <label key={`label${name}${idx}`} htmlFor={name}>
                  {label}
                </label>
                <textarea
                  name={name}
                  id={name}
                  placeholder={placeholder}
                  className={` ${errors && errors[name] ? "border-red-400" : "border-secondary dark:border-primary-dark "} overflow-ellipsis  rounded-md border-2 px-2   placeholder:text-secondary placeholder:dark:text-accent-dark`}
                  value={formData[name as keyof User]}
                  onChange={(e) => {
                    const newValue: string = e.target.value;
                    setFormData((prev: User) => ({
                      ...prev,
                      [name]: newValue,
                    }));
                  }}
                ></textarea>

                {errors && errors[name] && (
                  <p className='text-red-500 font-bold '>{errors[name][0]}</p>
                )}
                <br />
              </>
            );
          case "select":
            return (
              <>
                <label key={`label${name}${idx}`} htmlFor={name}>
                  {label}
                </label>
                <select
                  name={name}
                  id={name}
                  className={` ${errors && errors[name] ? "outline-red-400" : "outline-secondary dark:border-primary-dark dark:outline-primary-dark "} overflow-ellipsis rounded-md border-2 px-2   placeholder:text-secondary placeholder:dark:text-accent-dark`}
                  onChange={(e) => {

                    let newValue = e.target.value;
                    console.log("New",newValue)
                    if (!isNaN(Number(newValue))) {
                      newValue = Number(newValue);
                    }
                    setFormData((prev: User) => ({
                      ...prev,
                      [name]: newValue,
                    }));
                  }}
                >
                  <option value='' className='dark:text-accent-dark text-black dark:bg-accent'>
                    ----Choose a role----
                  </option>
                  {options?.map((option: string, i: number) => {
                    
                    return (
                      <option
                        className={` overflow-ellipsis hover:text-secondary-dark blur:dark:bg-secondary-dark  rounded-md border-2 px-2 dark:text-accent-dark text-black dark:bg-accent`}
                        key={i}
                        value={option}
                      >
                        {option}
                      </option>
                    );
                  })}
                </select>
                {errors && errors[name] && (
                  <p className='text-red-500 font-bold '>{errors[name][0]}</p>
                )}
                <br />
              </>
            );
          case "radio":
            return (
              <>
                <label key={`label${name}${idx}`}>{label}</label>
                <div className='flex flex-col gap-2'>
                  {options?.map((option: string, i: number) => (
                    <div key={i} className='flex items-center gap-2'>
                      <input
                        type='radio'
                        name={name}
                        id={`${name}-${i}`}
                        value={option}
                        checked={formData[name] === option}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            [name]: e.target.value,
                          }))
                        }
                      />
                      <label htmlFor={`${name}-${i}`}>{option}</label>
                    </div>
                  ))}
                </div>
                {errors && errors[name] && (
                  <p className='text-red-500 font-bold'>{errors[name][0]}</p>
                )}
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
                  className={`${errors && errors[name] ? "border-red-400" : "border-secondary dark:border-primary-dark"} overflow-ellipsi rounded-md border-2  px-2`}
                  value={formData[name as keyof User] ?? ""}
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
                {errors && errors[name] && (
                  <p className='text-red-500  font-bold'>{errors[name][0]}</p>
                )}
                <br />
              </>
            );
        }
      })}
      <button type='submit' className='bg-secondary dark:bg-accent-dark dark:text-primary-dark rounded-md text-primary'>
        Submit
      </button>
    </div>
  );
}

export default FormFields;
