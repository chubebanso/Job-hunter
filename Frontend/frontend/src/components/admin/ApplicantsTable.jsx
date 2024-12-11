import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application); // Giả sử bạn đã lưu data vào store
    const data = applicants?.data?.result || []; // Lấy danh sách ứng viên từ API

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.get(`${USER_API_END_POINT}/all`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell> {/* Hiển thị tên ứng viên */}
                                <TableCell>{item.email}</TableCell> {/* Hiển thị email */}
                                <TableCell>{item.age}</TableCell> {/* Hiển thị độ tuổi */}
                                <TableCell>{item.role?.name || 'N/A'}</TableCell> {/* Hiển thị role, nếu có */}
                                <TableCell>{item.gender || 'N/A'}</TableCell> {/* Hiển thị giới tính */}
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {
                                                shortlistingStatus.map((status, index) => (
                                                    <div 
                                                        onClick={() => statusHandler(status, item.id)} 
                                                        key={index} 
                                                        className='flex w-fit items-center my-2 cursor-pointer'>
                                                        <span>{status}</span>
                                                    </div>
                                                ))
                                            }
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable;
