import React, { useState } from "react"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function registerUser(){
    const navigate = useNavigate();
    const [userData , setUserData] = useState({
        name:'' ,
        email:'' ,
        password:'' ,
        role:''
    })

    const handlechange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: value, 
        }));
    };
    const handleRegister = ()=>{
       fetch(`http://localhost:3200/api/v1/auth/register`, {
                   method: "POST",
                   headers: {
                       
                       "Content-Type": "application/json",
                   },
                  
                  body: JSON.stringify(userData),
               })
                   .then((response) => {
                     
                       if (!response.ok) {
                           throw new Error("Network response was not ok");
                       }
                       return response.json();
                   })
                   .then(() => {
                       toast.success("User Registered successfully!");
           
                       setTimeout(() => {
                           navigate("/");
                       }, 3500);
                   })
                   .catch((error) => {
                       toast.error("Failed to add class. Please try again.");
                       console.error("Error:", error);
                   });
           };
    

    return (
        <>
        <div>
        <label htmlFor="name" > Name:</label>
        <input name="name" type="text" onChange={handlechange}></input>
       </div>
       <div>
        <label htmlFor="email"> Email:</label>
        <input name="email" type="email" onChange={handlechange}></input>
       </div>
       <div>
        <label htmlFor="password">Password:</label>
        <input name="password" type="password" onChange={handlechange} />
       </div>
       <label htmlFor="role" > UserRole:</label>
       <select name="role" onChange={handlechange}> 
       <option key="teacher" value="teacher" >teacher </option>
       <option key="student" value="student">student </option>
       <option key="admin" value="admin">admin </option>
       </select>
       <div>
        <button onClick={handleRegister}>Register</button>
      
       </div>
        </>
    )
}