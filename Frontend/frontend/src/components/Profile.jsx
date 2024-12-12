import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail } from 'lucide-react';
import { Badge } from './ui/badge';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';

const Profile = () => {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [profileId, setProfileId] = useState(null);
    const [skillsList, setSkillsList] = useState([]); // All available skills
    const [selectedSkills, setSelectedSkills] = useState([]); // Selected skills

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
        }
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

            {/* Applied Jobs */}
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>

            {/* Update Profile Dialog */}
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
