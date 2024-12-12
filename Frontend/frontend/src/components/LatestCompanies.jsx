import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LatestCompanies = () => {
    const [companies, setCompanies] = useState([]); // State to store the list of companies
    const [loading, setLoading] = useState(true); // State to manage loading state
    const [error, setError] = useState(null); // State to manage error messages
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // Retrieve token from localStorage
                if (!token) {
                    console.error('Access token not found!');
                    setError('You are not authorized to view this content.');
                    setLoading(false);
                    return;
                }

                // API call to fetch companies
                const response = await axios.get('http://localhost:8080/api/v1/companies/all', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the headers
                    },
                });

                // Update state with the fetched data
                setCompanies(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching companies:', error);
                setError('Failed to fetch companies. Please try again later.');
                setLoading(false);
            }
        };

        fetchCompanies(); // Fetch companies on component mount
    }, []); // Empty dependency array ensures this effect runs only once

    return (
        <div className="max-w-7xl mx-auto my-20">
            <h1 className="text-4xl font-bold">
                <span className="text-[#6A38C2]">Latest & Top </span> Companies
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-5">
                {loading ? (
                    <span>Loading...</span> // Show loading state
                ) : error ? (
                    <span className="text-red-500">{error}</span> // Show error message if there's an error
                ) : companies.length === 0 ? (
                    <span>No Companies Available</span> // Show message if no companies are available
                ) : (
                    companies.map((company) => (
                        <div
                            key={company.id}
                            className="p-6 rounded-md shadow-xl bg-white border border-gray-200 relative cursor-pointer"
                            onClick={() => navigate(`/company/${company.id}`)} // Navigate to company detail page
                        >
                            {/* Company Logo */}
                            <div className="flex justify-center mb-4">
                                <img
                                    src={`/avatars/${company.logo}`} // Assuming /avatars/ serves images correctly
                                    alt={`${company.name} logo`}
                                    className="w-32 h-32 object-cover rounded-md" // Larger image size
                                />
                            </div>

                            {/* Company Name */}
                            <h2 className="font-bold text-lg text-center">{company.name}</h2>

                            {/* Description */}
                            <p className="text-gray-600 text-sm text-center mt-2">
                                {company.description}
                            </p>

                            {/* Footer Section */}
                            <div className="absolute bottom-0 left-0 w-full bg-gray-100 p-3 flex justify-between items-center rounded-b-md">
                                {/* Address */}
                                <p className="text-gray-600 text-sm">{company.address}</p>
                                {/* Job Count */}
                                <div className="flex items-center text-green-600 font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-green-600 mr-2"></span>
                                    {company.jobCnt} Jobs {/* Replace this with dynamic job count if available */}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LatestCompanies;
