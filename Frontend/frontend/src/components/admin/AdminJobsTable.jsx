import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal, Trash2 } from 'lucide-react'; // Trash2 added for delete
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const AdminJobsTable = () => {
    const [jobs, setJobs] = useState([]); // Jobs list
    const [companyId, setCompanyId] = useState(null); // Company ID
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanyId = async () => {
            const accessToken = localStorage.getItem('accessToken'); // Get access token
            const userData = JSON.parse(localStorage.getItem('user')); // Get user data from local storage

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
                        setCompanyId(response.data.data.id); // Set the company ID
                        fetchJobs(response.data.data.id); // Fetch jobs using the company ID
                    } else {
                        toast.error('Company not found.');
                    }
                } catch (error) {
                    console.error('Error fetching company:', error);
                    toast.error('Failed to fetch company information.');
                }
            } else {
                toast.error('Access token or user data is missing.');
            }
        };

        const fetchJobs = async (companyId) => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:8080/api/v1/jobs/${companyId}/all`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (response.status === 200 && response.data?.data) {
                    setJobs(response.data.data); // Set the jobs data
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                toast.error('Failed to fetch jobs.');
            }
        };

        fetchCompanyId(); // Fetch company ID and jobs on component load
    }, []);

    const handleDeleteJob = async (jobId) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.delete(`http://localhost:8080/api/v1/jobs/${jobId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            toast.success('Job deleted successfully.');
            setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId)); // Update job list after deletion
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error('Failed to delete job.');
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of all jobs for the company</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Job Type</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Skills</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {jobs.map((job) => (
                        <TableRow key={job.id}>
                            <TableCell>{job.name}</TableCell>
                            <TableCell>{job.description}</TableCell>
                            <TableCell>{job.salary}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>{job.jobType}</TableCell>
                            <TableCell>{job.experience}</TableCell>
                            <TableCell>{job.position}</TableCell>
                            <TableCell>
                                {job.skills?.length > 0
                                    ? job.skills.map((skill) => skill.name).join(', ')
                                    : 'None'}
                            </TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div
                                            onClick={() => navigate(`/admin/jobs/${job.id}`)}
                                            className="flex items-center gap-2 w-fit cursor-pointer"
                                        >
                                            <Edit2 className="w-4" />
                                            <span>Edit</span>
                                        </div>
                                        <div
                                            onClick={() => navigate(`/admin/jobs/${job.id}/applicants`)}
                                            className="flex items-center w-fit gap-2 cursor-pointer mt-2"
                                        >
                                            <Eye className="w-4" />
                                            <span>Applicants</span>
                                        </div>
                                        <div
                                            onClick={() => handleDeleteJob(job.id)}
                                            className="flex items-center w-fit gap-2 cursor-pointer mt-2 text-red-500"
                                        >
                                            <Trash2 className="w-4" />
                                            <span>Delete</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default AdminJobsTable;
