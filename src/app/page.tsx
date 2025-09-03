"use client"
import { Suspense, useState } from "react";
import Form from "./components/Form";
import Table from "./components/Table";
import Loading from "./components/Loading";

export default function Home() {
  const [currentComponent, setCurrentComponent] = useState("Form");
  return (
    <main className="overflow-hidden">
      <ul className="sticky top-5 grid place-self-center grid-cols-2 gap-2  bg-secondary text-accent ">
        <li className="bg-secondary border-primary  border-r-4 p-2">
          <button onClick={()=>setCurrentComponent("Form")}>Form</button>
         
        </li>
        <li className="bg-secondary p-2"><button onClick={()=> setCurrentComponent("Table")}>Table</button></li>

      </ul>
      <Suspense fallback={<Loading/>}>

     { currentComponent == "Form" ? <Form/> : <Table/>}
      </Suspense>
      
    </main>
  );
}
