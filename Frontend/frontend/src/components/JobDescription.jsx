import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from './shared/Footer';

const JobDescription = () => {
    const [company, setCompany] = useState(null); // Thông tin công ty
    const [jobs, setJobs] = useState([]); // Danh sách công việc
    const [loading, setLoading] = useState(true); // Trạng thái tải
    const [error, setError] = useState(null); // Trạng thái lỗi
    const params = useParams();
    const companyId = params.id; // Lấy ID công ty từ URL

    useEffect(() => {
        const fetchCompanyAndJobs = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken'); // Lấy accessToken từ localStorage

                if (!accessToken) {
                    throw new Error('Access token not found. Please log in again.');
                }

                // Fetch company details
                const companyResponse = await axios.get(`http://localhost:8080/api/v1/companies/${companyId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Thêm token vào headers
                    },
                });

                // Fetch job details
                const jobResponse = await axios.get(`http://localhost:8080/api/v1/jobs/${companyId}/all`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Thêm token vào headers
                    },
                });

                if (companyResponse.data.statusCode === 200) {
                    setCompany(companyResponse.data.data); // Lưu thông tin công ty
                }

                if (Array.isArray(jobResponse.data.data)) {
                    setJobs(jobResponse.data.data); // Lưu danh sách công việc
                } else {
                    setJobs([]); // Nếu không phải mảng, đặt giá trị mặc định
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false); // Tắt trạng thái tải
            }
        };

        fetchCompanyAndJobs(); // Gọi API khi component được mount
    }, [companyId]);

    if (loading) {
        return <div>Loading data...</div>; // Hiển thị trạng thái tải
    }

    if (error) {
        return <div className="text-red-500">{error}</div>; // Hiển thị thông báo lỗi
    }

    return (
        <div>
            <div className='max-w-7xl mx-auto my-10 grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Left Column: Company Details */}
                <div className='p-6 bg-white rounded-lg shadow-md border'>
                    <div className='flex items-center gap-4 mb-6'>
                        {/* Logo */}
                        {company?.logo && (
                            <img
                                src={`/avatars/${company.logo}`} // Thay đổi URL logo theo đường dẫn tĩnh
                                alt={`${company.name} logo`}
                                className="w-32 h-32 object-cover rounded-md"
                            />
                        )}
                        {/* Tên công ty */}
                        <div>
                            <h1 className='text-3xl font-bold text-gray-800'>{company?.name || 'Company Name'}</h1>
                            <p className='text-gray-600 text-sm'>{company?.address || 'Not specified'}</p>
                        </div>
                    </div>

                    {/* Mô tả */}
                    <div className="mb-6">
                        <h2 className="font-semibold text-lg text-gray-700">About:</h2>
                        <p className="text-gray-600 text-sm mt-2">{company?.description || 'No description provided'}</p>
                    </div>

                    {/* Website */}
                    {company?.website && (
                        <div className="mt-6">
                            <h2 className="font-semibold text-lg text-gray-700">Website:</h2>
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline text-sm"
                            >
                                {company.website}
                            </a>
                        </div>
                    )}
                </div>

                {/* Right Column: Job Details */}
                <div>
                    {jobs.length > 0 ? (
                        jobs.map((job) => (
                            <div key={job.id} className='p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg shadow-lg border mb-6'>
                                <h1 className='font-bold text-2xl mb-6 text-purple-900'>{job.name || 'Job Title'}</h1>
                                <div className='mb-6'>
                                    <h2 className='font-semibold text-lg text-gray-700'>Description:</h2>
                                    <p className='text-gray-600'>{job.description || 'No description provided'}</p>
                                </div>
                                <div className='mb-6'>
                                    <h2 className='font-semibold text-lg text-gray-700'>Salary:</h2>
                                    <p className='text-gray-600'>{job.salary || 'Not specified'}</p>
                                </div>
                                <div className='mb-6'>
                                    <h2 className='font-semibold text-lg text-gray-700'>Location:</h2>
                                    <p className='text-gray-600'>{job.location || 'Not specified'}</p>
                                </div>
                                <div className='mb-6'>
                                    <h2 className='font-semibold text-lg text-gray-700'>Job Type:</h2>
                                    <p className='text-gray-600'>{job.jobType || 'Not specified'}</p>
                                </div>
                                <div className='mb-6'>
                                    <h2 className='font-semibold text-lg text-gray-700'>Experience:</h2>
                                    <p className='text-gray-600'>{job.experience || 'Not specified'} years</p>
                                </div>
                                <div className='mb-6'>
                                    <h2 className='font-semibold text-lg text-gray-700'>Position:</h2>
                                    <p className='text-gray-600'>{job.position || 'Not specified'}</p>
                                </div>

                                {/* Skills */}
                                <div className='flex flex-wrap gap-4 mb-6'>
                                    {job.skills.map((skill) => (
                                        <Badge
                                            key={skill.id}
                                            className='bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold'
                                        >
                                            {skill.name}
                                        </Badge>
                                    ))}
                                </div>
                                <Button className='rounded-lg w-full py-3 font-semibold bg-purple-700 text-white hover:bg-purple-800'>
                                    Apply Now
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p>No jobs available for this company.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default JobDescription;
