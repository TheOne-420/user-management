"use client";

import React, { FormEvent, Suspense, use, useEffect, useState } from "react";
import { getUsers } from "../actions/getUsers";
import { User, UserSchema } from "../validation/UserSchema";
import { deleteUser } from "../actions/deleteUser";
import { getUserById } from "../actions/getUserById";
import z, { regex } from "zod";
import EditModal from "./EditModal";
import { updateUsers } from "../actions/updateUsers";
import Navbar from "./Navbar";
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";
import Loading from "./Loading";
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
  const [sortTerm, setSortTerm] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage, setUsersPerPage] = useState<number>(5);
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
  function sortTable(key: string) {
    let direction = "ascending";
    if (
      sortTerm &&
      sortTerm.key === key &&
      sortTerm.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortTerm({ key, direction });
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users?.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil((users?.length ?? 0) / usersPerPage) || 1;
  const sortedUsers = [
    ...(searchTerm ? filteredUsers ?? [] : currentUsers ?? []),
  ].sort((a, b) => {
    if (sortTerm === null) {
      return 0;
    }
    const aValue = a[sortTerm.key];
    const bValue = b[sortTerm.key];
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue);
      return sortTerm.direction === "ascending" ? comparison : -comparison;
    }

    if (aValue < bValue) {
      return sortTerm.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortTerm.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  useEffect(() => {
    if (!sortTerm) return;
    setUsers(sortedUsers);
  }, [sortTerm]);
  return (
    <>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <div className='md:flex hidden overflow-auto w-screen p-4 h-screen  flex-col place-content-center text-primary'>
          <input
            type='text'
            name='search'
            id='search'
            value={searchTerm}
            placeholder='Search by name/email'
            className=' text-center font-bold  bg-accent rounded-md   placeholder:text-primary placeholder:font-light placeholder:text-center w-full'
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
                    <th
                      key={`header${i}`}
                      className='cursor-pointer'
                      onClick={() => sortTable(header)}
                    >
                      <p className='p-2'>
                        {header !== undefined &&
                          header?.charAt(0).toUpperCase() +
                            header?.slice(1).toLowerCase()}
                        {sortTerm?.key === header && (
                          <span className='ml-1'>
                            {sortTerm.direction === "ascending" ? "▲" : "▼"}
                          </span>
                        )}
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
              <ArrowBigLeftDash />
              Previous
            </button>
            <span className='self-center mx-2 font-bold bg-gray-700 p-2 rounded'>
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
        </div>
        <div className='md:hidden p-2 overflow-auto m-2 grid grid-cols-1 gap-4 w-screen place-self-center h-screen'>
          <div>
            {/* {"This application is best viewed on a larger screen."} */}
            {(!searchTerm ? currentUsers : filteredUsers)?.map((data, i) => (
              <div
                key={`row${i}`}
                className=' bg-neutral-50 shadow-2xl  text-left border-b border-gray-200 m-4 p-4 rounded-lg'
              >
                {headers?.map(
                  (header, j) =>
                    header && (
                      <div key={`cell${i}-${j}`} className='mb-2'>
                        <p className='font-bold '>
                          {header !== undefined &&
                            header?.charAt(0).toUpperCase() +
                              header?.slice(1).toLowerCase()}
                        </p>
                        <p className='w-48 overflow-ellipsis overflow-hidden whitespace-nowrap '>
                          {data[header as keyof User]}
                        </p>
                      </div>
                    )
                )}
                <div className='grid text-primary '>
                  <td className='w-full'>
                    <button
                      className=' w-full  bg-blue-700 p-2 rounded-md'
                      onClick={() => handleEdit(data?.id)}
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
              </div>
            ))}
          </div>
        </div>
        {userToEdit && (
          <EditModal
            userToEdit={userToEdit}
            handleSubmit={handleSubmit}
            setUserToEdit={setUserToEdit}
            errors={errors}
          />
        )}
      </Suspense>
    </>
  );
}
export default Table;
