import {React , useEffect, useState} from "react"
import Styled from "styled-components"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function AddCourse({courseId}){
    

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    console.log("userId", userId)
    

    const [courseData, setCourseData] = useState({
        title: '',
        description:'',
        pic:'' ,
        document:'' ,
        teacher: userId ,
        schedule:[{
            day:'' ,
            startTime:'' ,
            endTime:''
        }

        ]
    }      
    );
    const [image, setImage] = useState(null);
    const [pdf, setPdf] = useState(null);
    const [schedule , setSchedule] = useState({
        day:'' ,
        startTime:'' ,
        endTime:''
    })
    const [scheduleS , setScheduleS] = useState([])

    useEffect(() => {
        setCourseData(prev => ({
            ...prev,
            teacher: userId
        }));
    }, [userId]);
    
    

        useEffect(() => {
                if (courseId) {
                    fetch(`http://localhost:3200/api/v1/courses/${courseId}`, {
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
                        console.log("Fetched Data:", data);
                        setCourseData(data.Courses);
                    })
                    .catch((err) => console.error(err));
                }
            }, [courseId, token]);




       

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file); // Store actual file instead of URL
        }
    };
    
    const handlePdfChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPdf(file); // Store actual file instead of name
        }
    };

    const handleValue=(e)=>{
        console.log(e)
        const { name, value } = e.target;
        setCourseData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if(name==="pic") setImage(value)
        if(name==="day" || name==="startTime" || name==="endTime")   {
            console.log([name],value)
            setSchedule((p)=>({ ...p , [name]:value ,}));
        } 
    }

    const handleAddSchedule=()=>{
        console.log("Addschedule")
        setScheduleS((prev) => [...prev, schedule]);
        setCourseData((prev) => ({
            ...prev,
            schedule: [...prev.schedule, schedule],
        }));
        setSchedule({ day: "", startTime: "", endTime: "" });
    }
    
    const handleDeleteSchedule=(index)=>{
        setScheduleS((prev) => {
            const updatedSchedules = prev.filter((_, i) => i !== index);
            setCourseData((prevCourseData) => ({
                ...prevCourseData,
                schedule: updatedSchedules,
            }));
            return updatedSchedules;
        });
    }


    const handleAddCourse = () => {
       // console.log("Sending courseData:", JSON.stringify(courseData, null, 2));
        const validSchedule = courseData.schedule.filter(s => s.day && s.startTime && s.endTime);
        const formData = new FormData();
        formData.append("title", courseData.title);
        formData.append("description", courseData.description);
        formData.append("teacher", courseData.teacher);
        formData.append("schedule", JSON.stringify(validSchedule));
    
        if (image) {
            formData.append("pic", image);  // Append actual file
        }
        if (pdf) {
            formData.append("document", pdf);  // Append actual file
        }
    
        formData.forEach((value, key) => {
            console.log(key, value);
        });
    
        fetch(`http://localhost:3200/api/v1/courses`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(() => {
                toast.success("Class Added successfully!");
    
                setTimeout(() => {
                    navigate("/courses");
                }, 3500);
            })
            .catch((error) => {
                toast.error("Failed to add class. Please try again.");
                console.error("Error:", error);
            });
    };
    
const handleUpdateCourse=()=>{
    fetch(`http://localhost:3200/api/v1/courses`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            toast.success('Class Added successfully!', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            });

            setTimeout(() => {
                navigate('/courses');
            }, 3500);
        })
        .catch((error) => {
            toast.error('Failed to add class. Please try again.', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            });
            console.error('Error:', error);
        });
}


const handleCancelCourse=()=>{
    setCourseData('') ;
    navigate('/courses');
}
    return (
        <Wrapper>
            <h4 className="title">Course Management</h4>
            <div className="top-container">           
            
            <div className="item"><label htmlFor="title" className="label">Title:</label>
            <input name="title" type="text" className="input" onChange={handleValue}></input>
            </div>
            <div className="item">
            <label htmlFor="description" className="label">Description:</label>
            <input name="description" type="text" onChange={handleValue} className="input"></input>
            </div>
             {/* Image Upload */}
             <div className="img-container item">
                <label className="label">Course Image:</label>
                <input type="file" accept="image/*" onChange={handlePdfChange}  name="pic"/>
                {image && <img src={image} alt="Selected" width="150" />}
            </div>

            {/* PDF Upload */}
            <div className="img-container item">
                <label className="label">Upload PDF/DOC Files:</label>
                <input type="file" accept="application/pdf" onChange={handleImageChange} className="input"  name="document"/>
                {pdf && <p>Selected PDF: {pdf}</p>}
            </div>
            </div>

            <div><label  className="label">Schedule:</label>             
            <label htmlFor="day"></label>
            <select name="day" onChange={handleValue}>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>

            </select>
            <select name="startTime" onChange={handleValue}>
            {Array.from({ length: 18 - 6 + 1 }, (_, i) => 6 + i).map((time) => (
                <option key={time} value={time}>
                {time}:00
                </option>
            ))}
            </select>
            <select name="endTime" onChange={handleValue}>
            {Array.from({ length: 18 - 6 + 1 }, (_, i) => 6 + i).map((time) => (
                <option key={time} value={time}>
                {time}:00
                </option>
            ))}
            </select>
            <button onClick={handleAddSchedule}>Add Schedule</button> 
            <div className="list-container"> 
            {scheduleS.map((item, index) => ( // Corrected index and item order
                <div key={`l-${index}`}>
                    <div className="item">
                        {item.day} - {item.startTime} - {item.endTime} {/* Fixed property names */}
                        <button onClick={() => handleDeleteSchedule(index)}>Delete schedule</button> {/* Use index instead of _id */}
                    </div>
            </div>
    ))}
              
            </div>   
            </div>
            <button onClick={handleAddCourse}>Add</button>    
            <button onClick={handleUpdateCourse}>Edit</button>    
            <button onClick={handleCancelCourse}>Cancel</button>    

        </Wrapper>
    )
}


const Wrapper = Styled.section`
    

    .title {
        position: fixed;
        top: 60px;
        left: 0;
        width: 100%;
        background-color: #f8f9fa;
        padding: 10px;
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    }

    .top-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two equal columns */
  gap: 10px; /* Space between grid items */
  padding: 20px;
}

.item {
  background-color: lightgray;
  padding: 20px;
  text-align: center;
  border: 1px solid #ccc;
}
    
.list-container{
display: grid;
grid-template-rows: repeat(1, 1fr); 
}
// .img-container {
    //  display: flex;
        
    // }
 

    // .label {
    //     font-weight: bold;
    //     margin-bottom: 5px;
    //     gap:10px;
    // }

    // .input {
    //     width: 100%;
    //     padding: 8px;
    //     border: 1px solid #ccc;
    //     border-radius: 5px;
    // }

    select, button {
        margin-top: 10px;
        padding: 8px;
        border-radius: 5px;
        border: 1px solid #ccc;
    }

    button {
        background-color: #007bff;
        color: white;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
`;
