import React, { useState } from "react"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/lms1.png";

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
                           navigate("/login");
                       }, 3500);
                   })
                   .catch((error) => {
                       toast.error("Failed to add class. Please try again.");
                       console.error("Error:", error);
                   });
           };
    

    return (
        <Wrapper>
        <form
  encType="multipart/form-data"
  onSubmit={(e) => {
    e.preventDefault();
    handleRegister();
  }}
>
            <div className="logo-container">
                <img src={Logo} className="logo" alt="Logo" />
            </div>
        <div className="input-group">
        <label htmlFor="name" > Name:</label>
        <input name="name" type="text" onChange={handlechange}></input>
       </div>
       <div className="input-group">
        <label htmlFor="email"> Email:</label>
        <input name="email" type="email" onChange={handlechange}></input>
       </div>
       <div className="input-group">
        <label htmlFor="password">Password:</label>
        <input name="password" type="password" onChange={handlechange} />
       </div>
      <div className="input-group">
       <label htmlFor="role" > UserRole:</label>
       <select name="role" onChange={handlechange}> 
       <option key="teacher" value="teacher" >teacher </option>
       <option key="student" value="student">student </option>
       <option key="admin" value="admin">admin </option>
       </select></div>
       <div>
        <button type="submit">Register</button>
        
       </div>
       </form>
       </Wrapper>
    )
}


const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;

  .logo-container {
    margin-bottom: 10px;
  }

  .logo {
    width: 100px;
  }

  form {
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    width: 280px;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
  }

  label {
    font-size: 14px;
    margin-bottom: 3px;
    align: start ;
  }

  input ,select {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }

  button {
    background: #007bff;
    color: white;
    padding: 8px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  }

  button:hover {
    background: #0056b3;
  }

  p {
    margin-top: 5px;
    font-size: 14px;
  }

  .member-btn {
    color: #007bff;
    text-decoration: none;
    margin-left: 5px;
  }

  .member-btn:hover {
    text-decoration: underline;
  }
`;
