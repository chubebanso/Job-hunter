import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div onClick={()=> navigate(`/description/:id`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
            <div>
                <h1 className='font-medium text-lg'>Companyname</h1>
                <p className='text-sm text-gray-500'>VN</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>Jobtitle</h1>
                <p className='text-sm text-gray-600'>jobdescription</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">jobPositions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">jobType</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">jobsalary VND</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards