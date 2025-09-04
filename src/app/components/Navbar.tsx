"use client";
import Link from "next/link";
import React, {  use, useState } from "react";
import { useTheme } from "../contexts/ThemeProvider";

function Navbar() {
    const {theme, setTheme} = useTheme();
  return (
    <nav className='sticky top-0 z-50 backdrop-blur-lg  flex flex-1 items-center justify-around bg-secondary text-primary p-4 shadow-md dark:bg-primary-dark dark:text-accent-dark'>
      <div className="flex gap-2 items-center justify-around">

     
      <Link href='/form' className='underline flex-1'>
        Form
      </Link>
      <Link href='/table' className='underline flex-1'>
        Table
      </Link>
      <button
      className={`flex-1 max-w-[70px] text-center p-4 rounded-4xl ${theme === "light" ? "bg-gray-800 text-neutral-50" : "bg-gray-300 text-black"}`}
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
      >
        { theme === "light" ?  "DARK" : "LIGHT"}
      </button> </div>
    </nav>
  );
}

export default Navbar;
