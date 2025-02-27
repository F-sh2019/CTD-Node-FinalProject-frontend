import React ,{ useEffect, useState} from "react"
import Styled from "styled-components"
import { toast } from "react-toastify";

import { useNavigate  ,useParams } from "react-router-dom";


export default function AddCourse(){
    

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
   
    const navigate= useNavigate() ;
    const { id } = useParams();
   
   const courseId = id === "null" ? null : id;
    const [courseData, setCourseData] = useState({
        title: '',
        description:'',
        pic:'' ,
        document:'' ,
        teacher: userId ,
        schedule:[]
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
            //console.log("courseId",courseId)

            fetch(`https://ctd-node-final-farkhondehsh.onrender.com/api/v1/courses/${courseId}`, {
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
                setCourseData(data.course);
                setScheduleS(data.course.schedule)
           
            })
            .catch((err) => console.error(err));
        }
    }, [courseId, token]);




       

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setImage(file); 
          setCourseData((prev) => ({ ...prev, pic: file.name }));
        }
      };
      
      const handlePdfChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setPdf(file); 
          setCourseData((prev) => ({ ...prev, document: file.name }));
        }
      };

    const handleValue = (e) => {
        //console.log(e);
        const { name, value } = e.target;
    
        setCourseData((prev) => ({
            ...prev,
            [name]: value, 
        }));
    
        if (name === "pic") setImage(value);
    
        if (name === "day" || name === "startTime" || name === "endTime") {
          
            setSchedule((prev) => ({
                ...prev,
                [name]: prev[name] ? `${prev[name]}, ${value}` : value, 
            }));
        }
        
    };
    
    const handleAddSchedule = () => {
       // e.preventDefault();
    
        if (!schedule.day || !schedule.startTime || !schedule.endTime) {
            toast.error("Please fill out all schedule fields before adding.");
            return;
        }
    
        
        setScheduleS((prev) => [...prev, schedule]);
        setCourseData((prev) => ({
        ...prev,
        schedule: [...prev.schedule, schedule],
    }));

        setSchedule({ day: "", startTime: "", endTime: "" });
    };
    
    
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


    // const handleAddCourse = () => {
           


    //     fetch(`https://ctd-node-final-farkhondehsh.onrender.com/api/v1/courses`, {
    //         method: "POST",
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Content-Type": "application/json",
    //         },
    //        // body: formData,
    //        body: JSON.stringify(courseData),
    //     })
    //         .then((response) => {
              
    //             if (!response.ok) {
    //                 throw new Error("Network response was not ok");
    //             }
    //             return response.json();
    //         })
    //         .then(() => {
    //             toast.success("Class Added successfully!");
    
    //             setTimeout(() => {
    //                 navigate("/courses");
    //             }, 3500);
    //         })
    //         .catch((error) => {
    //             toast.error("Failed to add class. Please try again.");
    //             console.error("Error:", error);
    //         });
    // };
    

    const handleAddCourse = () => {
       
        const formData = new FormData();
        formData.append("title", courseData.title);
        formData.append("description", courseData.description);
        formData.append("teacher", userId);
        formData.append("schedule", JSON.stringify(courseData.schedule));
      
        if (image) {
          formData.append("pic", image);  // Append the image File object
        }
        if (pdf) {
          formData.append("document", pdf);  // Append the document File object
        }
      
        fetch(`https://ctd-node-final-farkhondehsh.onrender.com/api/v1/courses`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Note: Do not set "Content-Type" header when sending FormData,
            // the browser will set the correct multipart boundary automatically.
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
      
// const handleUpdateCourse=()=>{
   
//     fetch(`https://ctd-node-final-farkhondehsh.onrender.com/api/v1/courses/${courseId}`, {
//         method: 'PATCH',
//         headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(courseData),
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(() => {
//             toast.success('Class Added successfully!');

//             setTimeout(() => {
//                 navigate('/courses');
//             }, 3500);
//         })
//         .catch((error) => {
//             toast.error('Failed to add class. Please try again.');
//             console.error('Error:', error);
//         });
// }
const handleUpdateCourse = () => {
    
    const formData = new FormData();
  
    // Append text fields
    formData.append("title", courseData.title);
    formData.append("description", courseData.description);
    formData.append("teacher", userId);
    formData.append("schedule", JSON.stringify(scheduleS));
  
    // Append files only if new ones were selected.
    if (image instanceof File) {
      formData.append("pic", image);
    }
    if (pdf instanceof File) {
      formData.append("document", pdf);
    }
    console.log(formData)
    // Send the PATCH request without manually setting the Content-Type header.
    fetch(`https://ctd-node-final-farkhondehsh.onrender.com/api/v1/courses/${courseId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Do NOT set "Content-Type" here.
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
        console.log("successful")
        toast.success("Course updated successfully!");
        setTimeout(() => {
          navigate("/courses");
        }, 3500);
      })
      .catch((error) => {
        toast.error("Failed to update course. Please try again.");
        console.error("Error:", error);
      });
  };
  


const handleCancelCourse=()=>{
    
    setCourseData({
        title: '',
        description: '',
        pic: '',
        document: '',
        teacher: userId,
        schedule: []
    });
    navigate('/courses');
   
}
    return (
        <Wrapper>
            <form encType="multipart/form-data" onSubmit={(e) => {
                e.preventDefault();
                courseId ? handleUpdateCourse() : handleAddCourse();
                }}>
            
            <h4 className="title">Course Management</h4>
            
            <div className="top-container">           
            
            <div className="item"><label htmlFor="title" className="label">Title:</label>
            <input name="title" type="text" className="input" onChange={handleValue} value={courseData.title} ></input>
            </div>
            <div className="item">
            <label htmlFor="description" className="label">Description:</label>
            <input name="description" type="text" onChange={handleValue} className="input" value={courseData.description}></input>
            </div>
             {/* Image Upload */}
             <div className="img-container item">
                <label className="label">Course Image:</label>
                <input type="file" accept="image/*" onChange={handleImageChange}  name="pic" />
                { image ? (
                    // A new file has been selected, show its preview.
                    <img src={URL.createObjectURL(image)} alt="Selected" width="150" />
                    ) : courseData.pic ? (
                    // No new file selected, but courseData.pic exists (fetched from backend).
                    <img src={`http://localhost:3200${courseData.pic}`} alt="Course" width="150" />
                    ) : (
                    // No image to display; you can show a placeholder or nothing.
                    <p>No image selected</p>
                    )
                }
            </div>

            {/* PDF Upload */}
            <div className="img-container item">
  <label className="label">Upload PDF/DOC Files:</label>
  <input type="file" accept="application/pdf" onChange={handlePdfChange} name="document" />
  { pdf ? (
      // If a new file is selected, show its name
      <p>Selected PDF: {pdf.name}</p>
    ) : courseData.document ? (
      // If no new file is selected but there's an existing document, show a link
      <a
        href={`http://localhost:3200${courseData.document}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View Document
      </a>
    ) : (
      // If nothing is available, show a placeholder message
      <p>No document selected</p>
    )
  }
</div>

            </div>

            <div><label  className="label">Schedule:</label>             
            <label htmlFor="day"></label>
            <select name="day" onChange={handleValue}  >
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
            <button type="submit">{!courseId ? "Add Course" : "Edit Course"}</button>
             <button type="button" onClick={handleCancelCourse}>Cancel</button>
            
             </form>
        </Wrapper>
    )
}


const Wrapper = Styled.section`
    

    .title {
        position: fixed;
        top: 80px;
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
