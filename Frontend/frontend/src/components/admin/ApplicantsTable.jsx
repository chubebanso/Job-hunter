import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Edit, Trash } from 'lucide-react'; // Import các icon Edit và Trash
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const ApplicantsTable = () => {
    const [data, setData] = useState([]); // State để lưu danh sách ứng viên
    const [loading, setLoading] = useState(true); // State để hiển thị trạng thái tải dữ liệu
    const [selectedUser, setSelectedUser] = useState(null); // State để lưu thông tin ứng viên được chọn
    const [isModalOpen, setIsModalOpen] = useState(false); // State để điều khiển hiển thị modal
    const navigate = useNavigate();

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

    // Hàm xử lý mở modal chỉnh sửa
    const handleEdit = (user) => {
        setSelectedUser(user); // Lưu thông tin người dùng được chọn
        setIsModalOpen(true); // Mở modal
    };

    // Hàm xử lý cập nhật thông tin người dùng
    const handleSave = async (id) => {
        try {
            const response = await axios.put(
                `http://localhost:8080/api/v1/users/update/${id}`,
                {
                    name: selectedUser.name,
                    email: selectedUser.email,
                    age: selectedUser.age,
                    gender: selectedUser.gender
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                    withCredentials: true
                }
            );
    
            if (response.data.success) {
                toast.success("Cập nhật thông tin thành công.");
                setIsModalOpen(false); // Đóng modal
                navigate(`/admin/:id/applicants`);
                window.location.reload();
                
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật thông tin.");
        }
    };
    

    // Hàm xử lý đóng modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
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
                                            onClick={() => handleEdit(item)} // Gọi hàm handleEdit
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

            {isModalOpen && (
                <div className="modal fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h2 className="text-lg font-semibold mb-4">Edit User</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={selectedUser?.name || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={selectedUser?.email || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Age</label>
                            <input
                                type="number"
                                value={selectedUser?.age || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, age: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                            <input
                                type="text"
                                value={selectedUser?.gender || ''}
                                onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSave(selectedUser.id)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicantsTable;