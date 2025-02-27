import { useState, useEffect } from "react";
import styled from "styled-components";

const Home = () => {
    const [userData, setUserData] = useState(null);
    const [userId, setUserId] = useState(localStorage.getItem("userId"));

    console.log("userId from localStorage:", userId);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!userId) {
            console.warn("UserId is missing in localStorage");
            return;
        }

        fetch("https://ctd-node-final-farkhondehsh.onrender.com/api/v1/auth/getallusers", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        .then((response) => {
            if (!response.ok) throw new Error("Cannot find user");
            return response.json();
        })
        .then((data) => {
            console.log("Fetched user data:", data);
            const filteredUser = data.Users.find(user => user._id === userId);
            console.log("Matched User:", filteredUser);
            setUserData(filteredUser || null);
        })
        .catch((error) => console.error("Error fetching users:", error));
    }, [userId]); // Re-run effect if userId changes

    return (
        <Wrapper>
        <div className="maincontainer">
           
            {userData ? (
               <div > <p>User:</p>
               <p className="data"> {userData.name}!</p>
                <p>User-role:</p>
                <p className="data">{userData.role} !</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
            
        <div className="footer">
        <p>Welcome to the Course Management Module of LMS</p>
        <p>This application was implemented by <b>Farkhondeh Shahbazi</b></p>
        <p>as a final project for the <b>Code The Dream Node class</b></p>
      </div>
        
        </Wrapper>
    );
};

export default Home;


const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
   height: 60vh;
  background-color: #f5f5f5;
  padding: 20px;
  box-sizing: border-box; /* Ensures padding is included in the 100vh */
  overflow: hidden;      /* Prevents scrolling */

  .maincontainer {
   margin-top: 0px; 
    background: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    width: 280px;
  }


.data{
color:blue ;
}
  
  p {
    margin-top: 5px;
    font-size: 14px;
  }
    .footer{
    text-align: center;
  p {
     margin-top: auto;
    font-size: 14px;
  }
    }

  
`;
const Footer = styled.div`
  text-align: center;
  p {
     margin-top: auto;
    font-size: 14px;
  }
`;