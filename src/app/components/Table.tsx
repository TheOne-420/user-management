"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { getUsers } from "../actions/getUsers";
import { User, UserSchema } from "../validation/UserSchema";
import { deleteUser } from "../actions/deleteUser";
import { getUserById } from "../actions/getUserById";
import z from "zod";
import EditModal from "./EditModal";
import { updateUsers } from "../actions/updateUsers";
const dummyData = [
  {
    fullName: "Tabish",
    email: "tab@gmail.com",
    age: 20,
    role: "Admin",
    bio: "I'm Tabish",
  },
  {
    fullName: "Dev",
    email: "Dev@gmail.com",
    age: 20,
    role: "Editor",
    bio: "I'm Dev",
  },
];
function Table() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [fields, setFields] = useState(null);
  const [errors, setErrors] = useState(null);
  const [headers, setHeaders] = useState<string[]>([]);
  useEffect(() => {
    async function loadFields() {
      const response = await fetch("/schema.json");
      const result = await response.json();

      const rowNames = result?.fields?.map((res) => {
        if (res.table) {
          return res.name;
        }
      });
      setHeaders(rowNames);
    }
    loadFields();
    setUsers(getUsers());
  }, []);
  function handleEdit(id:string) {
      setUserToEdit(getUserById(id));
  }
  function handleDelete(id: string){
    setUsers(deleteUser(id));
  }
   function handleSubmit(e: FormEvent){
    e.preventDefault();
    setErrors(null)
    if (!userToEdit) {
      return;
    }
    const res = z.safeParse(UserSchema,userToEdit);

    if (!res.success) {
      setErrors(z.flattenError(res.error).fieldErrors);
      return;
    }
    const updatedUsers = users?.map(user => {
      if (user.id === userToEdit.id) {
        return userToEdit;
      }
      return user;
    });
    setUserToEdit(null);
    window?.location.reload();
    updateUsers(updatedUsers!)
  }
  return (
    <>
      {/* <input
        type='text'
        name='search'
        id='search'
        placeholder='Search by name/email'
        className='bg-black placeholder:text-accent placeholder:font-light placeholder:text-center w-full'
      /> */}
      <div className='overflow-auto w-screen p-4 h-screen flex flex-col place-content-center text-accent'>
        {users ? (
          <h1 className='font-bold  text-black'>Users from localStorage</h1>
        ) : (
          <h1>Dummy Data</h1>
        )}
        <table className='w-full bg-gray-600'>
          <thead>
            <tr className='text-left  border-b-4 border-gray-400 font-bold'>
              {headers?.map((header, i) => {
                if (!header) {
                  return null;
                }
                return (
                  <th key={`header${i}`} className=''>
                    <p className='p-2 '>
                      {header !== undefined &&
                        header?.charAt(0).toUpperCase() +
                          header?.slice(1).toLowerCase()}
                    </p>
                  </th>
                );
              })}
              <th className='text-center   p-2'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users?.map((data, i) => (
              <tr
                key={`row${i}`}
                className= ' not-odd:bg-lime-600  text-left border-b border-gray-200'
              >
                {headers?.map(
                  (header, j) =>
                    header && (
                      <td key={`cell${i}-${j}`}>
                        <p className='w-48 overflow-ellipsis overflow-hidden whitespace-nowrap p-2'>
                          {data[header as keyof User]}
                        </p>
                      </td>
                    )
                )}
                <div className='grid place-content-center '>
                  <td className='w-full'>
                    <button className=' w-full  bg-blue-700 text-accent p-2 rounded-md'
                    onClick={()=>handleEdit(data.id)}
                    >
                      EDIT
                    </button>
                  </td>
                  <td className='w-full'>
                    <button className=' w-full bg-red-700 text-accent p-2 rounded-md'
                    onClick={()=>handleDelete(data.id)}
                    >
                      DELETE
                    </button>
                  </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
        {userToEdit && (
        <EditModal userToEdit={userToEdit} handleSubmit={handleSubmit} setUserToEdit={setUserToEdit} errors={errors}  />
      )}
      </div>
    </>
  );
}
export default Table;
