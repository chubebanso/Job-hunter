import React from 'react'
import { Badge } from './ui/badge'

const LatestJobCards = () => {
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border-gray-100 cursor-pointer'>
            <div>
                <h1 className='font-medium text-lg'>Company name</h1>
                <p className='text-sm text-gray-500'>Việt Nam</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>Job title</h1>
                <p className='text-sm text-gray-600'>Chi tiết việc</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">Vị trí</Badge>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">part-full time</Badge>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">thông tin thêm</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards
