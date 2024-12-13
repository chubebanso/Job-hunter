import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Contact, Mail } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [skillsList, setSkillsList] = useState([]); // All available skills
    const [selectedSkills, setSelectedSkills] = useState([]); // Selected skills
    const [acceptedJobs, setAcceptedJobs] = useState([]); // List of accepted jobs
    const [profileForm, setProfileForm] = useState({ bio: '', phoneNumber: '', dateOfBirth: '' }); // Profile form data

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
                .then((response) => {
                    if (!response.ok) throw new Error('Profile not found');
                    return response.json();
                })
                .then((data) => {
                    setProfile(data.data);
                    setProfileId(data.data.id); // Save profileId
                    localStorage.setItem('profileId', data.data.id); // Save profileId in localStorage
                })
                .catch(() => {
                    setProfile(null); // No profile found
                });

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
                .then((data) => setAcceptedJobs(data.data || []))
                .catch((error) => console.error('Error fetching accepted jobs:', error));
        }
    }, []);

    const handleCreateProfile = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const accessToken = localStorage.getItem('accessToken');

        if (!storedUser?.id || !accessToken) {
            alert('User is not authenticated.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/profiles/create/${storedUser.id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bio: profileForm.bio,
                    phoneNumber: profileForm.phoneNumber,
                    dateOfBirth: profileForm.dateOfBirth,
                }),
            });

            if (!response.ok) throw new Error('Failed to create profile');

            const data = await response.json();
            setProfile(data.data); // Set the created profile
            setProfileId(data.data.id); // Set profile ID
            localStorage.setItem('profileId', data.data.id); // Save profileId in localStorage
            alert('Profile created successfully.');
        } catch (error) {
            console.error('Error creating profile:', error);
            alert('Failed to create profile.');
        }
    };

 const handleSkillToggle = async (skillId) => {
    const accessToken = localStorage.getItem('accessToken');
    const isSkillSelected = selectedSkills.includes(skillId);

    if (!profileId) {
        alert('Profile not found. Please create a profile first.');
        return;
    }

    try {
        if (isSkillSelected) {
            // Call API to remove skill
            const response = await fetch(
                `http://localhost:8080/api/v1/profiles/${profileId}/skills/remove/${skillId}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to remove skill');
            }

            // Update the selected skills list
            setSelectedSkills((prevSkills) => prevSkills.filter((id) => id !== skillId));
            alert('Skill removed successfully.');
        } else {
            // Call API to add skill
            const response = await fetch(
                `http://localhost:8080/api/v1/profiles/${profileId}/skills/add/${skillId}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to add skill');
            }

            // Update the selected skills list
            setSelectedSkills((prevSkills) => [...prevSkills, skillId]);
            alert('Skill added successfully.');
        }
    } catch (error) {
        console.error('Error toggling skill:', error);
        alert('Failed to update skills. Please try again.');
    }
};
useEffect(() => {
    const fetchUserSkills = async () => {
        const accessToken = localStorage.getItem('accessToken');

        if (!profileId || !accessToken) {
            console.error('Profile ID or access token missing.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/v1/profiles/${profileId}/skills/get`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user skills');
            }

            const data = await response.json();
            if (data?.data) {
                const userSkillIds = data.data.map((skill) => skill.id); // Extract skill IDs
                setSelectedSkills(userSkillIds); // Set selected skills
            }
        } catch (error) {
            console.error('Error fetching user skills:', error);
        }
    };

    if (profileId) {
        fetchUserSkills(); // Fetch user skills when profileId is available
    }
}, [profileId]);


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
                            <h2 className='font-bold text-lg mb-3'>Create Profile</h2>
                            <div className='my-4'>
                                <label>Bio</label>
                                <input
                                    type='text'
                                    value={profileForm.bio}
                                    onChange={(e) =>
                                        setProfileForm({ ...profileForm, bio: e.target.value })
                                    }
                                    className='border p-2 w-full'
                                />
                            </div>
                            <div className='my-4'>
                                <label>Phone Number</label>
                                <input
                                    type='text'
                                    value={profileForm.phoneNumber}
                                    onChange={(e) =>
                                        setProfileForm({ ...profileForm, phoneNumber: e.target.value })
                                    }
                                    className='border p-2 w-full'
                                />
                            </div>
                            <div className='my-4'>
                                <label>Date of Birth</label>
                                <input
                                    type='date'
                                    value={profileForm.dateOfBirth}
                                    onChange={(e) =>
                                        setProfileForm({ ...profileForm, dateOfBirth: e.target.value })
                                    }
                                    className='border p-2 w-full'
                                />
                            </div>
                            <Button onClick={handleCreateProfile}>Create Profile</Button>
                        </div>
                    )}
                </div>

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
                                <h2 className='font-bold text-lg'>{job.name || 'Job Title'}</h2>
                                <p className='text-gray-700'>{job.description || 'No description provided'}</p>
                                <p className='text-sm text-gray-500'>
                                    <strong>Location:</strong> {job.location || 'Not specified'}
                                </p>
                                <p className='text-sm text-gray-500'>
                                    <strong>Salary:</strong> {job.salary || 'Not specified'}
                                </p>
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
