"use client";
import Link from "next/link";
import React, { use, useState } from "react";
import { useTheme } from "../contexts/ThemeProvider";
import { MoonStarIcon, Sun } from "lucide-react";

function Navbar() {
  const { theme, setTheme } = useTheme();
  return (
    <nav className='overflow-hidden sticky top-0 z-50 backdrop-blur-lg  flex flex-1 items-center justify-around bg-secondary text-primary p-4 shadow-md dark:bg-secondary-dark dark:text-accent-dark'>
      <div className=' px-4 rounded-4xl shadow-2xl backdrop-blur-2xl  border-neutral-50 border-2  flex gap-2 w-[80%] items-center justify-around'>
        <Link href='/form' className='underline flex-1'>
          FORM
        </Link>
        <Link href='/table' className='underline flex-1'>
          TABLE
        </Link>
        <button
          className={` text-center p-4 rounded-4xl ${
            theme === "light"
              ? "bg-gray-800 text-neutral-50"
              : "bg-gray-300 text-black"
          }`}
          onClick={() => {
            setTheme(theme === "light" ? "dark" : "light");
          }}
        >
          {theme === "light" ? <MoonStarIcon /> : <Sun />}
        </button>{" "}
      </div>
    </nav>
  );
}

export default Navbar;
