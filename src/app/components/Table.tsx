"use client";

import React, { useEffect, useState } from "react";
import { getUsers } from "../actions/getUsers";
import { User } from "../validation/UserSchema";
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
  const [headers, setHeaders] = useState<string[]>([]);
  useEffect(() => {
    async function loadFields() {
      const response = await fetch("/schema.json");
      const result = await response.json();
      const rowNames = result?.fields?.map((res) => {
        return res.name;
      });
      setHeaders(rowNames);
    }
    loadFields();
    setUsers(getUsers());
    
  }, []);
  
  
  return (
    <>
      {/* <input
        type='text'
        name='search'
        id='search'
        placeholder='Search by name/email'
        className='bg-black placeholder:text-accent placeholder:font-light placeholder:text-center w-full'
      /> */}
      <div className="overflow-hidden w-screen p-4 h-screen flex flex-col place-content-center text-accent">

      { users ?  <h1 className="font-bold  text-black">Users from localStorage</h1> : <h1>Dummy Data</h1> }
      <table className='w-full bg-gray-600'>
        <thead>
          <tr className='text-left  border-b-4 border-gray-400 font-bold'>
            {headers?.map((header, i) => {
              return (
                <th key={`header${i}`} className=''>
                  <p className='p-2 '>
                    {header.charAt(0).toUpperCase() +
                      header.slice(1).toLowerCase()}
                  </p>
                </th>
              );
            })}
            <th className='text-center   p-2' >
              Actions
            </th>
          </tr>
        </thead>
          
        <tbody className=''>
          
          { 
            users?.map((data, i) => (
              <tr
                key={`row${i}`}
                className='text-left border-b border-gray-200'
              >
                {headers?.map((header, j) => (
                  <td key={`cell${i}-${j}`}>
                    <p className=' overflow-ellipsis overflow-hidden whitespace-nowrap  p-2'>
                      {" "}
                      {data[header]}
                    </p>
                  </td>
                ))}
                <div className='grid place-content-center '>
                  <td className='w-full'>
                    <button className='w-full bg-blue-700 text-accent p-2 rounded-md'>
                      EDIT
                    </button>
                  </td>
                  <td className='w-full'>
                    <button className=' w-full bg-red-700 text-accent p-2 rounded-md'>
                      DELETE
                    </button>
                  </td>
                </div>
              </tr>
            ))
          
          }
        </tbody>
      </table>
      </div>
    </>
  );
}

export default Table;
