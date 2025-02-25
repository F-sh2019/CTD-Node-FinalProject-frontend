import Styled from "styled-components";
import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

export default function Courses() {
    const [courseData, setCourseData] = useState([]);

    const userid = localStorage.getItem("userId");
    
    const token = localStorage.getItem("token");
    

    useEffect(() => {
        fetch("http://localhost:3200/api/v1/courses/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to fetch course data");
            }
            return response.json();
        })
        .then((data) =>{
            console.log("Fetched Data:", data); // Debugging
            setCourseData(data.Courses);
        })
        .catch((err) => console.error(err));
    }, []);

    const navigate=useNavigate();       

    const handleEditCourse=(courseId)=>{
       console.log(courseId)
      
        navigate(`/courses/${courseId}`) 
    }

    const handelAddCourse=()=>{
        navigate(`/courses/${null}`) 
    }

    return (
        <Wrapper>
            <h4 className="Title">Course Management</h4>
            <div className="top-container">
                    <button
                        className="action-button user"
                        name="createUser"
                        onClick={handelAddCourse}
                    >
                        <FaUserPlus />
                        <span className="description">Register New User</span>
                    </button>
                </div>

            <div className="grid-container">
            {courseData.map((course, index) => 
                <div key={index} className="grid-item">
                    <img id={`img${index}`} src={course.pic} alt={course.title} />
                    <label htmlFor={`img${index}`}>{course.title}</label>
                    <div className="grid-item">
                    <button onClick={()=>handleEditCourse(course._id)}>Edit</button>
                    <button>Delete</button>
                    </div>
                </div>
            )}
            </div>
        </Wrapper>
    );
}

const Wrapper = Styled.section`
    align-items: center;
    gap: 10px;
     .grid-container {
      display: flex;
    flex-direction: column;
    align-items: center;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
    text-align: center;
    }

    .grid-item {
       display: flex;
    gap: 10px;  
    margin-top: 10px;

    button {
        padding: 8px 12px;
        border: none;
        background: #007bff;
        color: white;
        cursor: pointer;
        border-radius: 5px;
        transition: 0.3s;

        &:hover {
            background: #0056b3;
        }
    }
    }
`;
