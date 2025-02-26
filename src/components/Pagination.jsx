import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <Wrapper>
            <nav className="pagination">
                <button
                    name="prev-button"
                    className="page-button"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    Previous
                </button>
                {getPageNumbers().map((number) => (
                    <button
                        key={number}
                        className={`page-button ${number === currentPage ? 'active' : ''}`}
                        onClick={() => onPageChange(number)}
                    >
                        {number}
                    </button>
                ))}
                <button
                    name="next-button"
                    className="page-button"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    Next
                </button>
            </nav>
        </Wrapper>
    );
};

Pagination.propTypes = {
    totalItems: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;

const Wrapper = styled.section`
    .pagination {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin: 1rem 0;
    }
    .page-button {
        padding: 0.5rem 1rem;
        border: 1px solid #ccc;
        background-color: #fff;
        cursor: pointer;
    }

    .page-button.active {
        background-color: #007bff;
        color: #fff;
        border-color: #007bff;
    }

    button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
    }
`;
