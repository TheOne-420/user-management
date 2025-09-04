"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { getUsers } from "../actions/getUsers";
import { User, UserSchema } from "../validation/UserSchema";
import { deleteUser } from "../actions/deleteUser";
import { getUserById } from "../actions/getUserById";
import z, { regex } from "zod";
import EditModal from "./EditModal";
import { updateUsers } from "../actions/updateUsers";
import Navbar from "./Navbar";
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";
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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5); // Or any number you choose
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | "">("");
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
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchTerm);
    }, 1500);
    const searchResults = users?.filter((user) => {
      const regex = new RegExp(searchTerm, "i");
      try {
        return regex.test(user.email) || regex.test(user.fullName);
      } catch (error) {
        console.error(error);
        setSearchTerm("");
      }
    });
    setFilteredUsers(searchResults);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, users]);
  function handleEdit(id: string) {
    setUserToEdit(getUserById(id));
  }
  function handleDelete(id: string) {
    setUsers(deleteUser(id));
  }
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrors(null);
    if (!userToEdit) {
      return;
    }
    const res = z.safeParse(UserSchema, userToEdit);

    if (!res.success) {
      setErrors(z.flattenError(res.error).fieldErrors);
      return;
    }
    const updatedUsers = users?.map((user) => {
      if (user.id === userToEdit.id) {
        return userToEdit;
      }
      return user;
    });
    setUserToEdit(null);
    window?.location.reload();
    updateUsers(updatedUsers!);
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users?.length || 1 / usersPerPage);

  return (
    <>
      <Navbar />
      <div className='overflow-auto w-screen p-4 h-screen flex flex-col place-content-center text-primary'>
        <input
          type='text'
          name='search'
          id='search'
          value={searchTerm}
          placeholder='Search by name/email'
          className=' text-center font-bold  bg-accent rounded-md border-b-0 placeholder:text-primary placeholder:font-light placeholder:text-center w-full'
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className='w-full bg-gray-600 '>
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
            {(!searchTerm ? currentUsers : filteredUsers)?.map((data, i) => (
              <tr
                key={`row${i}`}
                className=' not-odd:bg-lime-600  text-left border-b border-gray-200'
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
                <div className='grid place-content-center text-primary '>
                  <td className='w-full'>
                    <button
                      className=' w-full  bg-blue-700 p-2 rounded-md'
                      onClick={() => handleEdit(data.id)}
                    >
                      EDIT
                    </button>
                  </td>
                  <td className='w-full'>
                    <button
                      className=' w-full bg-red-700  p-2 rounded-md'
                      onClick={() => handleDelete(data.id)}
                    >
                      DELETE
                    </button>
                  </td>
                </div>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='flex justify-center mt-4'>
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className='inline-flex place-content-center gap-2  p-2 mx-1 w-25 bg-gray-500 rounded'
          >
            < ArrowBigLeftDash />
            Previous 
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='inline-flex place-content-center gap-2 p-2 w-25 mx-1 bg-gray-500 rounded'
          >
            Next <ArrowBigRightDash />
          </button>
        </div>
        {userToEdit && (
          <EditModal
            userToEdit={userToEdit}
            handleSubmit={handleSubmit}
            setUserToEdit={setUserToEdit}
            errors={errors}
          />
        )}
      </div>
    </>
  );
}
export default Table;
