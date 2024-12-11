import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Edit, Trash } from 'lucide-react'; // Import các icon Edit và Trash
import { toast } from 'sonner';
import axios from 'axios';

const ApplicantsTable = () => {
    const [data, setData] = useState([]); // State để lưu danh sách ứng viên
    const [loading, setLoading] = useState(true); // State để hiển thị trạng thái tải dữ liệu

    // Lấy accessToken từ localStorage
    const accessToken = localStorage.getItem("accessToken");

    // Hàm gọi API
    const fetchApplicants = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/users/all', {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Gửi accessToken trong header
                },
                withCredentials: true
            });

            if (response.data && response.data.data && response.data.data.result) {
                setData(response.data.data.result); // Lưu dữ liệu vào state
                setLoading(false);
            } else {
                toast.error("Không có dữ liệu ứng viên.");
                setLoading(false);
            }
        } catch (error) {
            toast.error("Lỗi khi tải dữ liệu ứng viên.");
            console.error(error);
            setLoading(false);
        }
    };

    // Gọi API khi component được mount
    useEffect(() => {
        fetchApplicants();
    }, []);

    // Hàm xử lý cập nhật ứng viên
    const handleUpdate = (id) => {
        // Thực hiện logic cập nhật (hiển thị form hoặc điều hướng tới trang cập nhật)
        toast.info(`Cập nhật thông tin ứng viên với ID: ${id}`);
    };

    // Hàm xử lý xóa ứng viên
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8080/api/v1/users/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}` // Gửi accessToken trong header
                },
                withCredentials: true
            });

            if (res.data.success) {
                // Xóa user khỏi danh sách state
                setData((prevData) => prevData.filter((user) => user.id !== id));
                toast.success(res.data.message || "Xóa ứng viên thành công.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi xóa ứng viên.");
        }
    };

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
                        loading ? ( // Hiển thị trạng thái tải dữ liệu
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell> {/* Hiển thị tên ứng viên */}
                                    <TableCell>{item.email}</TableCell> {/* Hiển thị email */}
                                    <TableCell>{item.age}</TableCell> {/* Hiển thị độ tuổi */}
                                    <TableCell>{item.role?.name || 'N/A'}</TableCell> {/* Hiển thị role, nếu có */}
                                    <TableCell>{item.gender || 'N/A'}</TableCell> {/* Hiển thị giới tính */}
                                    <TableCell className="text-right flex gap-2 justify-end">
                                        {/* Icon Update */}
                                        <Edit
                                            className="cursor-pointer text-blue-500 hover:text-blue-700"
                                            size={20}
                                            onClick={() => handleUpdate(item.id)} // Gọi hàm handleUpdate
                                        />
                                        {/* Icon Delete */}
                                        <Trash
                                            className="cursor-pointer text-red-500 hover:text-red-700"
                                            size={20}
                                            onClick={() => handleDelete(item.id)} // Gọi hàm handleDelete
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
