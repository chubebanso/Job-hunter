import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CategoryCarousel = () => {
    const [skills, setSkills] = useState([]); // State to store skills fetched from API
    const [selectedSkills, setSelectedSkills] = useState([]); // State to store selected skills
    const [loading, setLoading] = useState(true); // State to handle loading
    const [error, setError] = useState(null); // State to handle errors

    // Fetch email and name from localStorage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const { email, name } = user;

    // Fetch skills from API
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const token = localStorage.getItem('accessToken'); // Get token from localStorage
                if (!token) {
                    console.error('Access token not found!');
                    setError('You are not authorized to view this content.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:8080/api/v1/all/skills', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Pass the token in the headers
                    },
                });

                setSkills(response.data.data); // Set the fetched skills
                setLoading(false);
            } catch (error) {
                console.error('Error fetching skills:', error);
                setError('Failed to fetch skills. Please try again later.');
                setLoading(false);
            }
        };

        fetchSkills(); // Call the function when the component is mounted
    }, []);

    // Handle skill selection
    const handleSkillChange = (event) => {
        const selectedSkillId = parseInt(event.target.value, 10);

        // If already selected, remove it; otherwise, add it
        if (selectedSkills.find((skill) => skill.id === selectedSkillId)) {
            setSelectedSkills((prev) =>
                prev.filter((skill) => skill.id !== selectedSkillId)
            );
        } else {
            const selectedSkill = skills.find((skill) => skill.id === selectedSkillId);
            setSelectedSkills((prev) => [...prev, selectedSkill]);
        }
    };

    // Handle API call to create subscriber
    const handleSubscribe = async () => {
        if (!email || !name) {
            alert('User information is missing. Please log in!');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken'); // Get token
            if (!token) {
                console.error('Access token not found!');
                return;
            }

            const subscriberData = {
                email,
                name,
                skills: selectedSkills.map((skill) => ({ id: skill.id })), // Map selected skills to API format
            };

            // API call to create subscriber
            const response = await axios.post('http://localhost:8080/api/v1/create/subscribers', subscriberData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token in the headers
                },
            });

            alert('Successfully subscribed to job updates!');
            console.log('Subscriber created:', response.data);
        } catch (error) {
            console.error('Error subscribing:', error);
            alert('Failed to subscribe. Please try again later.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto my-20">
            <h1 className="text-4xl font-bold mb-4">
                <span className="text-[#6A38C2]">Choose Your </span> Skills
            </h1>

            {loading ? (
                <span>Loading...</span>
            ) : error ? (
                <span className="text-red-500">{error}</span>
            ) : (
                <div className="flex flex-wrap gap-4 mb-8">
                    {skills.map((skill) => (
                        <div key={skill.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`skill-${skill.id}`}
                                value={skill.id}
                                onChange={handleSkillChange}
                                className="mr-2"
                                checked={selectedSkills.some((s) => s.id === skill.id)}
                            />
                            <label htmlFor={`skill-${skill.id}`} className="text-lg">
                                {skill.name}
                            </label>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={handleSubscribe}
                className="bg-[#6A38C2] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#5a2eaa] transition duration-300"
            >
                Receive by Email
            </button>
        </div>
    );
};

export default CategoryCarousel;
