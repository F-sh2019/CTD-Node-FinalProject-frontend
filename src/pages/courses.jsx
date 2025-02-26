import Styled from "styled-components";
import { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

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
            console.log("Fetched Data:", data.Courses); // Debugging
            setCourseData(data.Courses);
        })
        .catch((err) => console.error(err));
    }, []);

    const handleDeleteCourse=(courseId)=>{

       
        const confirmDelete = window.confirm(
            'Do you want to delete course ? This action cannot be undone.'
        );
        if (!confirmDelete) {
            alert('Deletion cancelled.');
            return;
        }

        fetch(`http://localhost:3200/api/v1/courses/${courseId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => {
                setCourseData((prevData) => prevData.filter((course) => course._id !== courseId));
                toast.success('Data Deleted successfully!');
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });

    }



    const navigate=useNavigate();       

    const handleEditCourse=(courseId)=>{
       //console.log(courseId)
      
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
                        <span className="description">Register New Class</span>
                    </button>
                </div>

            <div className="grid-container">
            {courseData.map((course, index) => 
                <div key={index} className="grid-item">
                    
                    <img id={`img${index}`} src={course.pic} alt={course.title} />
                    <label htmlFor={`img${index}`}>{course.description}</label>
                    <div className="grid-item">
                    <button onClick={()=>handleEditCourse(course._id)}>Edit</button>
                    <button onClick={()=>handleDeleteCourse(course._id)}>Delete</button>
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
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Two columns */
        gap: 20px; /* Spacing between items */
        justify-content: center;
        background: #f8f9fa;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
        text-align: center;
        width: 80%; /* Adjust width as needed */
        margin: auto;
    }

    .Title{
          position: sticky;
        top: 0;
        background: #fff; /* Set a background so content scrolling underneath doesn't show through */
        padding: 10px;
        z-index: 100; /* Ensures it stays above other content */
    }
    .grid-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;  
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
    }

    img {
        width: 150px;
        height: 100px;
        object-fit: cover;
        border-radius: 5px;
    }

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
`;
