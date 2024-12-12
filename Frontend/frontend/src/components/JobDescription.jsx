import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Footer from './shared/Footer';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    const isIntiallyApplied = user && singleJob?.applications?.some(application => application.applicant === user._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);

    const params = useParams();
    const job_id = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/${user._id}/add/jobs/${job_id}`, { withCredentials: true });

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/${job_id}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    if (user) {
                        setIsApplied(res.data.job.applications.some(application => application.applicant === user._id));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchSingleJob();
    }, [job_id, dispatch, user]);

    return (
        <div>   
        <div className='max-w-7xl mx-auto my-10 grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Left Column: General Information */}
            <div className='p-6 bg-white rounded-lg shadow-md border'>
                <h1 className='font-bold text-3xl mb-6 text-gray-800'>Job Details</h1>
                <div className='mb-6'>
                    <h2 className='font-semibold text-lg text-gray-700'> Salary:</h2>
                    <p className='text-gray-600'>{singleJob?.salary || 'Not specified'} VND</p>
                </div>
                <div className='mb-6'>
                    <h2 className='font-semibold text-lg text-gray-700'> Address:</h2>
                    <p className='text-gray-600'>{singleJob?.location || 'Not specified'}</p>
                </div>
                <div className='mb-6'>
                    <h2 className='font-semibold text-lg text-gray-700'> Description:</h2>
                    <p className='text-gray-600'>{singleJob?.description || 'No description provided'}</p>
                </div>
            </div>

            {/* Right Column: Form and Apply Button */}
            <div>
            <div className='p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg shadow-lg border mb-6'>
                    <h1 className='font-bold text-2xl mb-6 text-purple-900'>{singleJob?.title || 'Job Title'}</h1>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Name:</h2>
                        <p className='text-gray-600'>{singleJob?.name|| 'Not specified'} Tên job</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Description:</h2>
                        <p className='text-gray-600'>{singleJob?.description || 'No description provided'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Salary:</h2>
                        <p className='text-gray-600'>{singleJob?.salary || 'Not specified'} VND</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Location:</h2>
                        <p className='text-gray-600'>{singleJob?.location || 'Not specified'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> jobType:</h2>
                        <p className='text-gray-600'>{singleJob?.jobType || 'Not specified'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Experience:</h2>
                        <p className='text-gray-600'>{singleJob?.Experience || 'Not specified'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Position:</h2>
                        <p className='text-gray-600'>{singleJob?.position || 'Not specified'}</p>
                    </div>
                    
                    <div className='flex flex-wrap gap-4 mb-6'>
                    <Badge className='bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold'>{singleJob?.skill || 'C++'} </Badge>
                        <Badge className='bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold'>{singleJob?.skill || 'C'}</Badge>
                        <Badge className='bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold'>{singleJob?.skill || 'JAVA'} </Badge>
                    </div>
                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`rounded-lg w-full py-3 font-semibold ${isApplied ? 'bg-gray-400 text-gray-800 cursor-not-allowed' : 'bg-purple-700 text-white hover:bg-purple-800'}`}>
                        {isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>

                {/* Additional Apply Now Sections */}
                <div className='p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg shadow-lg border mb-6'>
                    <h1 className='font-bold text-2xl mb-6 text-purple-900'>{singleJob?.title || 'Job Title'}</h1>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Name:</h2>
                        <p className='text-gray-600'>{singleJob?.name|| 'Not specified'} Tên job</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Description:</h2>
                        <p className='text-gray-600'>{singleJob?.description || 'No description provided'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Salary:</h2>
                        <p className='text-gray-600'>{singleJob?.salary || 'Not specified'} VND</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Location:</h2>
                        <p className='text-gray-600'>{singleJob?.location || 'Not specified'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> jobType:</h2>
                        <p className='text-gray-600'>{singleJob?.jobType || 'Not specified'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Experience:</h2>
                        <p className='text-gray-600'>{singleJob?.Experience || 'Not specified'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Position:</h2>
                        <p className='text-gray-600'>{singleJob?.position || 'Not specified'}</p>
                    </div>
                    
                    <div className='flex flex-wrap gap-4 mb-6'>
                    <Badge className='bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold'>{singleJob?.skill || 'C++'} </Badge>
                        <Badge className='bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold'>{singleJob?.skill || 'C'}</Badge>
                        <Badge className='bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold'>{singleJob?.skill || 'JAVA'} </Badge>
                    </div>
                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`rounded-lg w-full py-3 font-semibold ${isApplied ? 'bg-gray-400 text-gray-800 cursor-not-allowed' : 'bg-purple-700 text-white hover:bg-purple-800'}`}>
                        {isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>

                <div className='p-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg shadow-lg border mb-6'>
                    <h1 className='font-bold text-2xl mb-6 text-purple-900'>{singleJob?.title || 'Job Title'}</h1>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Name:</h2>
                        <p className='text-gray-600'>{singleJob?.name|| 'Not specified'} Tên job</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Description:</h2>
                        <p className='text-gray-600'>{singleJob?.description || 'No description provided'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Salary:</h2>
                        <p className='text-gray-600'>{singleJob?.salary || 'Not specified'} VND</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Location:</h2>
                        <p className='text-gray-600'>{singleJob?.location || 'Not specified'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> jobType:</h2>
                        <p className='text-gray-600'>{singleJob?.jobType || 'Not specified'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Experience:</h2>
                        <p className='text-gray-600'>{singleJob?.Experience || 'Not specified'}</p>
                    </div>
                    <div className='mb-6'>
                        <h2 className='font-semibold text-lg text-gray-700'> Position:</h2>
                        <p className='text-gray-600'>{singleJob?.position || 'Not specified'}</p>
                    </div>
                    
                    <div className='flex flex-wrap gap-4 mb-6'>
                    <Badge className='bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold'>{singleJob?.skill || 'C++'} </Badge>
                        <Badge className='bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold'>{singleJob?.skill || 'C'}</Badge>
                        <Badge className='bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold'>{singleJob?.skill || 'JAVA'} </Badge>
                    </div>
                    <Button
                        onClick={isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`rounded-lg w-full py-3 font-semibold ${isApplied ? 'bg-gray-400 text-gray-800 cursor-not-allowed' : 'bg-purple-700 text-white hover:bg-purple-800'}`}>
                        {isApplied ? 'Already Applied' : 'Apply Now'}
                    </Button>
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    );
};

export default JobDescription;
