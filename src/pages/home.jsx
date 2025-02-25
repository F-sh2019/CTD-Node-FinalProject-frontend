import { useState, useEffect } from "react";

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

        fetch("http://localhost:3200/api/v1/auth/getallusers", {
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
        <div>
            <h1>Welcome to the Home Page</h1>
            {userData ? (
                <h2>Hello, {userData.role} {userData.name}!</h2>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Home;
