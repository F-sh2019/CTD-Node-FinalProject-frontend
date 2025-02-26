import React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';

import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaUserPlus } from 'react-icons/fa';

const UserManagement = () => {
    const [allUserData, setAllUserData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
   
    const labelMap = {
        name: 'Name',
        email: 'Email',
        role: 'Role',
        'Delete': 'Delete',
    };

    const token = localStorage.getItem('token');
    const currentUserId = localStorage.getItem('userId');

    useEffect(() => {
        fetch('http://localhost:3200/api/v1/auth/getallusers', {
            method: 'GET',
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
            .then((data) => {
                setAllUserData(data.Users);
                console.log(data)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const itemsPerPage = 10;
    const totalItems = allUserData.length ;

    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return allUserData.slice(startIndex, endIndex);
    };

  
    const handelDeleteUser = (userDelId) => {
        const confirmDelete = window.confirm(
            'Do you want to delete user ? This action cannot be undone.'
        );
        if (!confirmDelete) {
            alert('Deletion cancelled.');
            return;
        }

        fetch(`http://localhost:3200/api/v1/auth/deleteUser/${userDelId}`, {
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
                setAllUserData((prevData) => prevData.filter((user) => user._id !== userDelId));
                toast.success('Data Deleted successfully!');
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };
    const handelCreateUser = () => {
        navigate('/registerUser');
    };

    return (
        <>
            <Wrapper>
                <div className="top-container">
                    <button
                        className="action-button user"
                        name="createUser"
                        onClick={handelCreateUser}
                    >
                        <FaUserPlus />
                        <span className="description">Register New User</span>
                    </button>
                </div>

                <div className="grid-container">
                    {/* Render column headers
                    {fields.map((label, index) => (
                        <div key={index} className="grid-item grid-header">
                            {labelMap[label]}
                        </div>
                    ))} */}
                    {/* Render rows dynamically */}
                    {getCurrentItems().map((user, rowIndex) =>
                        //labelMap.map((label, colIndex) => (
                            <div key={`${rowIndex}-id`} className="grid-item">
                                {/* {label === 'Edit/Delete' ? ( */}
                                    <div className="actions">
                                        
                                        <button
                                            className={
                                                user._id !== currentUserId
                                                    ? 'action-button delete'
                                                    : 'action-button.delete.disabeld'
                                            }
                                            onClick={() => handelDeleteUser(user._id)}
                                            disabled={user._id === currentUserId ? true : false}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                {/* ) : ( */}
                                    user
                                {/* )} */}
                            </div>
                        //))
                    )}
                </div>
            </Wrapper>
            <Pagination
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </>
    );
};

export default UserManagement;

const Wrapper = styled.section`
    .top-container {
        margin-bottom: 1rem;
        padding-left: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .grid-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        padding: 10px;
    }

    .grid-item {
        padding: 20px;
        border: 1px solid #ccc;
        text-align: left;
        font-size: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: var(--border-radius);
        background-color: #fff;
    }

    .actions {
        display: flex;
        justify-content: space-around;
        align-items: center;
    }

    .action-button {
        display: flex;
        justify-content: flex-start;
        border: none;
        background: none;
        cursor: pointer;
        font-size: 1.2rem;
        transition: transform 0.2s ease-in-out;
    }
    .user {
        color: var(--color-blue-dark);
        font-size: 2rem;
    }

    .action-button:hover {
        transform: scale(1.2);
    }

    .action-button.view {
        color: var(--color-blue-dark);
    }

    .action-button.edit {
        color: var(--color-green-dark);
    }

    .action-button.delete {
        color: var(--color-alert);
    }
    .action-button.delete.disabeld {
        color: var(--color-gray);
    }
    .grid-item {
        padding: 20px;
        border: 1px solid #ccc;
        text-align: left;
        font-size: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: var(--border-radius);
        background-color: #fff;
    }
    .grid-header {
        font-weight: bold;
        background-color: var(--color-green-med);
        color: var(--color-blue-dark);
    }
    .description {
        margin: 0;
        padding-left: 1rem;
        font-size: 2rem;
    }
    @media (min-width: 600px) {
        .grid-container {
            grid-template-columns: repeat(4, 1fr);
        }
    }
    @media (min-width: 1024px) {
        .grid-container {
            grid-template-columns: repeat(5, 1fr);
        }
    }
    @media (min-width: 1440px) {
        .grid-container {
            grid-template-columns: repeat(5, 1fr);
        }
    }
`;
