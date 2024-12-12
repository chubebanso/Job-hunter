import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../shared/NavbarAdmin';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {
    const [input, setInput] = useState({
        name: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: '',
        experience: 0,
        position: 0,
        skills: [], // Selected skills to be included in the API call
    });
    const [loading, setLoading] = useState(false);
    const [skillsList, setSkillsList] = useState([]); // List of all available skills
    const [companyId, setCompanyId] = useState(null);
    const navigate = useNavigate();

    // Fetch company data based on user name in localStorage
    useEffect(() => {
        const fetchCompanyData = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const userData = JSON.parse(localStorage.getItem('user'));

            if (userData?.name && accessToken) {
                try {
                    const response = await axios.get(
                        `http://localhost:8080/api/v1/companies/name/${userData.name}`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    if (response.data?.data?.id) {
                        setCompanyId(response.data.data.id);
                    }
                } catch (error) {
                    console.error('Error fetching company data:', error);
                    toast.error('Failed to fetch company data. Please try again.');
                }
            } else {
                toast.error('Access token or user data not found.');
            }
        };

        fetchCompanyData();
    }, []);

    // Fetch all available skills
    useEffect(() => {
        const fetchSkills = async () => {
            const accessToken = localStorage.getItem('accessToken');

            try {
                const response = await axios.get('http://localhost:8080/api/v1/all/skills', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (response.data?.data) {
                    setSkillsList(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching skills:', error);
                toast.error('Failed to fetch skills.');
            }
        };

        fetchSkills();
    }, []);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // Handle skill selection toggle
    const handleSkillToggle = (skillId) => {
        const isSkillSelected = input.skills.some((skill) => skill.id === skillId);

        if (isSkillSelected) {
            setInput((prevState) => ({
                ...prevState,
                skills: prevState.skills.filter((skill) => skill.id !== skillId),
            }));
        } else {
            setInput((prevState) => ({
                ...prevState,
                skills: [...prevState.skills, { id: skillId }],
            }));
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
        if (!companyId) {
            toast.error('Company ID not found. Please make sure the company is registered.');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(
                `http://localhost:8080/api/v1/jobs/create/${companyId}`,
                input,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (res.status === 201) {
                toast.success(res.data.message || 'Job posted successfully!');
                navigate('/admin/jobs'); // Redirect to the jobs page
            } else {
                toast.error('Failed to create job. Please try again.');
            }
        } catch (error) {
            console.error('Error creating job:', error);
            toast.error(error.response?.data?.message || 'Failed to create job. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavbarAdmin />
            <div className="flex items-center justify-center w-screen my-5">
                <form
                    onSubmit={submitHandler}
                    className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
                >
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Job Title</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type="text"
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Experience Level (Years)</Label>
                            <Input
                                type="number"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                        <div>
                            <Label>Number of Positions</Label>
                            <Input
                                type="number"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                    </div>

                    {/* Skill Selection */}
                    <div className="my-4">
                        <Label>Select Required Skills</Label>
                        <div className="flex flex-wrap gap-2 my-2">
                            {skillsList.map((skill) => (
                                <button
                                    key={skill.id}
                                    type="button"
                                    onClick={() => handleSkillToggle(skill.id)}
                                    className={`px-3 py-1 border rounded ${
                                        input.skills.some((s) => s.id === skill.id)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200'
                                    }`}
                                >
                                    {skill.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Post New Job
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PostJob;
