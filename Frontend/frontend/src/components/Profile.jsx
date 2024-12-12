import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Contact, Mail } from 'lucide-react';
import { Badge } from './ui/badge';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [skillsList, setSkillsList] = useState([]); // All available skills
    const [selectedSkills, setSelectedSkills] = useState([]); // Selected skills
    const [acceptedJobs, setAcceptedJobs] = useState([]); // List of accepted jobs

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const accessToken = localStorage.getItem('accessToken');
        if (storedUser?.id && accessToken) {
            // Fetch user details
            fetch(`http://localhost:8080/api/v1/users/${storedUser.id}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            })
                .then((response) => response.json())
                .then((data) => setUser(data.data))
                .catch((error) => console.error('Error fetching user data:', error));

            // Fetch profile details
            fetch(`http://localhost:8080/api/v1/profiles/userID/${storedUser.id}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    setProfile(data.data);
                    setProfileId(data.data.id); // Save profileId
                })
                .catch((error) => console.error('Error fetching profile data:', error));

            // Fetch all skills
            fetch(`http://localhost:8080/api/v1/all/skills`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            })
                .then((response) => response.json())
                .then((data) => setSkillsList(data.data))
                .catch((error) => console.error('Error fetching skills list:', error));

            // Fetch accepted jobs
            fetch(`http://localhost:8080/api/v1/users/${storedUser.id}/accepted-jobs`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            })
                .then((response) => response.json())
                .then((data) => setAcceptedJobs(data))
                .catch((error) => console.error('Error fetching accepted jobs:', error));
        }
    }, []);
useEffect(() => {
    const fetchAcceptedJobs = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const accessToken = localStorage.getItem('accessToken');

        if (storedUser?.id && accessToken) {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/v1/users/${storedUser.id}/accepted-jobs`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch accepted jobs');
                }

                const data = await response.json();

                // Lưu danh sách công việc được accepted từ `data.data`
                if (Array.isArray(data.data)) {
                    setAcceptedJobs(data.data);
                } else {
                    console.error('Unexpected data format:', data);
                    setAcceptedJobs([]);
                }
            } catch (error) {
                console.error('Error fetching accepted jobs:', error);
            }
        }
    };

    fetchAcceptedJobs();
}, []);

    useEffect(() => {
        if (profileId) {
            const accessToken = localStorage.getItem('accessToken');
            // Fetch selected skills for the profile
            fetch(`http://localhost:8080/api/v1/profiles/${profileId}/skills/get`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.data) {
                        const selectedSkillIds = data.data.map((skill) => skill.id); // Extract skill IDs
                        setSelectedSkills(selectedSkillIds); // Set selected skills
                    }
                })
                .catch((error) => console.error('Error fetching selected skills:', error));
        }
    }, [profileId]);

    const handleSkillToggle = (skillId) => {
        const accessToken = localStorage.getItem('accessToken');
        const isSkillSelected = selectedSkills.includes(skillId);

        if (isSkillSelected) {
            // Call API to remove skill
            fetch(`http://localhost:8080/api/v1/profiles/${profileId}/skills/remove/${skillId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` },
            })
                .then((response) => {
                    if (!response.ok) throw new Error('Failed to remove skill');
                    setSelectedSkills((prevSkills) => prevSkills.filter((id) => id !== skillId));
                })
                .catch((error) => console.error('Error removing skill:', error));
        } else {
            // Call API to add skill
            fetch(`http://localhost:8080/api/v1/profiles/${profileId}/skills/add/${skillId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${accessToken}` },
            })
                .then((response) => {
                    if (!response.ok) throw new Error('Failed to add skill');
                    return response.json();
                })
                .then(() => {
                    setSelectedSkills((prevSkills) => [...prevSkills, skillId]);
                })
                .catch((error) => console.error('Error adding skill:', error));
        }
    };
const handleAcceptJob = async (jobId) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const accessToken = localStorage.getItem('accessToken');

    if (!storedUser?.id || !accessToken) {
        alert('User is not authenticated.');
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:8080/api/v1/users/${storedUser.id}/accept-job/${jobId}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to accept the job.');
        }

        alert('Job has been accepted.');
        // Cập nhật lại danh sách công việc sau khi nhận việc
        setAcceptedJobs((prevJobs) =>
            prevJobs.map((job) =>
                job.id === jobId ? { ...job, status: 'accepted' } : { ...job, status: 'rejected' }
            )
        );
    } catch (error) {
        console.error('Error accepting job:', error);
        alert('Failed to accept the job.');
    }
};

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className='h-24 w-24'>
                            <AvatarImage
                                src='https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg'
                                alt='profile'
                            />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.name}</h1>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg mb-3'>Personal Information</h1>
                    <div className='flex items-center gap-3 my-2'>
                        <span>Name:</span>
                        <span>{user?.name}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>Email: {user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <span>Gender:</span>
                        <span>{user?.gender === 'MALE' ? 'Male' : user?.gender === 'FEMALE' ? 'Female' : 'NA'}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <span>Age:</span>
                        <span>{user?.age || 'NA'}</span>
                    </div>
                </div>

                {/* Profile Information */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg mb-3'>Profile Information</h1>
                    {profile ? (
                        <>
                            <div className='flex items-center gap-3 my-2'>
                                <span>Bio:</span>
                                <span>{profile?.bio || 'NA'}</span>
                            </div>
                            <div className='flex items-center gap-3 my-2'>
                                <Contact />
                                <span>Phone Number: {profile?.phoneNumber || 'NA'}</span>
                            </div>
                            <div className='flex items-center gap-3 my-2'>
                                <span>Date of Birth:</span>
                                <span>{profile?.dateOfBirth || 'NA'}</span>
                            </div>
                        </>
                    ) : (
                        <div>
                            <span>No profile information available.</span>
                        </div>
                    )}
                </div>

                {/* Skills */}
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex flex-wrap gap-2'>
                        {skillsList.map((skill) => (
                            <button
                                key={skill.id}
                                type='button'
                                className={`px-3 py-1 border rounded ${
                                    selectedSkills.includes(skill.id)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-200'
                                }`}
                                onClick={() => handleSkillToggle(skill.id)}
                            >
                                {skill.name}
                            </button>
                        ))}
                    </div>
                    <div className='flex items-center gap-1 mt-3'>
                        {selectedSkills.length > 0 ? (
                            selectedSkills.map((id) => {
                                const skill = skillsList.find((s) => s.id === id);
                                return skill ? <Badge key={id}>{skill.name}</Badge> : null;
                            })
                        ) : (
                            <span>No skills selected</span>
                        )}
                    </div>
                </div>
            </div>

           {/* Accepted Jobs */}
<div className='max-w-4xl mx-auto bg-white rounded-2xl'>
    <h1 className='font-bold text-lg my-5'>Accepted Jobs</h1>
    {acceptedJobs.length > 0 ? (
        <div className='p-4'>
            {acceptedJobs.map((job) => (
                <div
                    key={job.id}
                    className={`p-4 border rounded-lg mb-4 shadow ${
                        job.status === 'accepted' ? 'bg-green-200' : 'bg-gray-100'
                    }`}
                >
                    {/* Job Details */}
                    <h2 className='font-bold text-lg'>{job.name || 'Job Title'}</h2>
                    <p className='text-gray-700'>{job.description || 'No description provided'}</p>
                    <p className='text-sm text-gray-500'>
                        <strong>Location:</strong> {job.location || 'Not specified'}
                    </p>
                    <p className='text-sm text-gray-500'>
                        <strong>Salary:</strong> {job.salary || 'Not specified'}
                    </p>

                    {/* Skills */}
                    <div className='flex flex-wrap gap-2 mt-2'>
                        {job.skills?.map((skill) => (
                            <Badge
                                key={skill.id}
                                className='bg-green-200 text-green-800 px-2 py-1 rounded'
                            >
                                {skill.name}
                            </Badge>
                        ))}
                    </div>

                    {/* Button to Accept the Job */}
                    <button
                        onClick={() => handleAcceptJob(job.id)}
                        className={`mt-4 px-4 py-2 rounded text-white ${
                            job.status === 'accepted' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                    >
                        {job.status === 'accepted' ? 'Accepted' : 'Accept Job'}
                    </button>
                </div>
            ))}
        </div>
    ) : (
        <p className='text-gray-500'>No jobs have been accepted yet.</p>
    )}
</div>


        </div>
    );
};

export default Profile;
