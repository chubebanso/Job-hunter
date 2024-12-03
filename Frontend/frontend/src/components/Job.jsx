import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'


const Job = ({job}) => {
    
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>1 ngay truoc</p>
                <Button variant="outline" className="rounded-full" size="icon"><Bookmark /></Button>
            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src="https://hust.edu.vn/vi/news/media/news-stories-showing-what-life-is-like-at-hust-573826.html" />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>Company name</h1>
                    <p className='text-sm text-gray-500'>HUST</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>Title</h1>
                <p className='text-sm text-gray-600'>Chi tiết</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost"> 100 slot</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">part-full time</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">10000vnd</Badge>
            </div>
            <div className='flex items-center gap-4 mt-4'>
                <Button onClick={()=> navigate(`/description/${job?._id}`)} variant="outline">Details</Button>
                <Button className="bg-[#7209b7]">Save For Later</Button>
            </div>
        </div>
    )
}

export default Job