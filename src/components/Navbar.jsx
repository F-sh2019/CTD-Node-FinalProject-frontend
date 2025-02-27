
import { Link } from "react-router-dom"
import React from "react"
import Styled from 'styled-components';
import Lms from "../assets/lms1.png"; 
import { useNavigate } from "react-router-dom";

const Navbar = (
 
) => {

  const navigate = useNavigate();

  const handleLogout = () => {
   
    localStorage.clear();
   
    navigate("/"); // Redirect to login
    window.location.reload(); // Refresh to update authentication state
  };

  return (
       <Wrapper>
        <nav className="navbar">
        <div className="logo"><img src={Lms} alt="Logo"/></div>
        <ul className="nav-links">
            
            <li className="nav-item"><Link to="/"> Home </Link></li>
            <li className="nav-item"><Link to="/courses"> Course Management </Link></li>
            {/* <li className="nav-item"><Link to="/register"> Registeration </Link></li>
            <li className="nav-item"><Link to="/search">search  </Link></li> */}
            {localStorage.getItem("userRole")==="admin" && <li className="nav-item"><Link to="/userManagement"> User Management </Link></li>}
            
        </ul>
        <button onClick={handleLogout}>Logout</button>
        </nav>
        </Wrapper>
    )
}

export default Navbar
const Wrapper = Styled.section`
height: 20vh;
display: flex;
justify-content: start;  /* Aligns items to the left */
gap: 20px; 
.logo img {
  height: 15vh;  /* Matches the navbar height */
  width: auto;
  margin-top:50px;
}
.navbar {
  position: fixed;  /* Stays at the top */
  top: 0;
  left: 0;
  height:10vh;
  width: 100%;
  background-color: #222;  /* Dark background */
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: start;
  gap: 20px ;
  align-items: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000; /* Ensures navbar stays above other content */
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 15px;
}

.nav-item {
  color: white;
  text-decoration: none;
  font-size: 16px;
  cursor: pointer;
}

.nav-item:hover {
  color: #f39c12; /* Highlight on hover */
}

.content {
  padding-top: 60px; /* Prevents content from being hidden under navbar */
}


`