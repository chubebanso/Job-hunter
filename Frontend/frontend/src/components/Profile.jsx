import React, { useState, useEffect } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [skillsList, setSkillsList] = useState([]);
    const [newProfile, setNewProfile] = useState({
        bio: '',
        phoneNumber: '',
        dateOfBirth: '',
        skills: [],
    });

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const accessToken = localStorage.getItem('accessToken');
        if (storedUser?.id && accessToken) {
            fetch(`http://localhost:8080/api/v1/users/${storedUser.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch user data');
                    }
                    return response.json();
                })
                .then(data => setUser(data.data))
                .catch(error => console.error('Error fetching user data:', error));

            fetch(`http://localhost:8080/api/v1/profiles/userID/${storedUser.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch profile data');
                    }
                    return response.json();
                })
                .then(data => setProfile(data.data))
                .catch(error => console.error('Error fetching profile data:', error));

            fetch(`http://localhost:8080/api/v1/all/skills`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch skills list');
                    }
                    return response.json();
                })
                .then(data => setSkillsList(data.data))
                .catch(error => console.error('Error fetching skills list:', error));
        }
    }, []);

    const handleCreateProfile = () => {
        const accessToken = localStorage.getItem('accessToken');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (accessToken && storedUser?.id) {
            fetch(`http://localhost:8080/api/v1/profiles/userID/${storedUser.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...newProfile,
                    skills: newProfile.skills,
                    resume: '',
                    resumeOriginalName: '',
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to create profile');
                    }
                    return response.json();
                })
                .then(data => setProfile(data.data))
                .catch(error => console.error('Error creating profile:', error));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProfile(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSkillToggle = (skillName) => {
        setNewProfile(prevState => {
            const skills = new Set(prevState.skills);
            if (skills.has(skillName)) {
                skills.delete(skillName);
            } else {
                skills.add(skillName);
            }
            return { ...prevState, skills: Array.from(skills) };
        });
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.name}</h1>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
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
                            <div className='flex flex-col gap-3'>
                                <label>
                                    Bio:
                                    <input
                                        type="text"
                                        name="bio"
                                        value={newProfile.bio}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                </label>
                                <label>
                                    Phone Number:
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        value={newProfile.phoneNumber}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                </label>
                                <label>
                                    Date of Birth:
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={newProfile.dateOfBirth}
                                        onChange={handleInputChange}
                                        className="border border-gray-300 rounded px-2 py-1 w-full"
                                    />
                                </label>
                                <label>
                                    Skills:
                                    <div className="flex flex-wrap gap-2">
                                        {skillsList.map(skill => (
                                            <button
                                                key={skill.id}
                                                type="button"
                                                className={`px-3 py-1 border rounded ${newProfile.skills.includes(skill.name) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                                onClick={() => handleSkillToggle(skill.name)}
                                            >
                                                {skill.name}
                                            </button>
                                        ))}
                                    </div>
                                </label>
                            </div>
                            <Button onClick={handleCreateProfile} className="mt-3" variant="outline">Create Profile</Button>
                        </div>
                    )}
                </div>

                {/* Skills */}
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>
                        {
                            profile?.skills?.length !== 0 ? profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) : <span>NA</span>
                        }
                    </div>
                </div>

                {/* Resume */}
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {
                        profile?.resume ? <a target='blank' href={profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{profile?.resumeOriginalName}</a> : <span>NA</span>
                    }
                </div>
            </div>

            {/* Applied Jobs */}
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;