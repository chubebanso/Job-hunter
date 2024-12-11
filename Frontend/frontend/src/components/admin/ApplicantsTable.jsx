import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ApplicantsTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplicant, setSelectedApplicant] = useState(null); // Dữ liệu ứng viên được chọn
    const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
    const accessToken = localStorage.getItem("accessToken");

    const fetchApplicants = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/users/all', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                withCredentials: true
            });

            if (response.data && response.data.data && response.data.data.result) {
                setData(response.data.data.result);
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

    useEffect(() => {
        fetchApplicants();
    }, []);

    const handleUpdate = (applicant) => {
        setSelectedApplicant(applicant); // Đặt ứng viên được chọn
        setIsModalOpen(true); // Mở modal
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/users/update`, // API cập nhật ứng viên
                {
                    name: selectedApplicant.name,
                    email: selectedApplicant.email,
                    age: selectedApplicant.age,
                    gender: selectedApplicant.gender,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}` // Gửi accessToken
                    },
                    withCredentials: true
                }
            );
    
            if (response.data.success) {
                // Cập nhật danh sách ứng viên trong state
                setData((prevData) =>
                    prevData.map((user) =>
                        user.id === selectedApplicant.id ? { ...user, ...selectedApplicant } : user
                    )
                );
    
                toast.success(response.data.message || "Cập nhật ứng viên thành công.");
            } else {
                toast.error(response.data.message || "Cập nhật ứng viên thất bại.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật ứng viên.");
            console.error(error);
        } finally {
            setIsModalOpen(false); // Đóng modal
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
                        loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">Loading...</TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.age}</TableCell>
                                    <TableCell>{item.role?.name || 'N/A'}</TableCell>
                                    <TableCell>{item.gender || 'N/A'}</TableCell>
                                    <TableCell className="text-right flex gap-2 justify-end">
                                        <Edit
                                            className="cursor-pointer text-blue-500 hover:text-blue-700"
                                            size={20}
                                            onClick={() => handleUpdate(item)} // Mở modal với thông tin ứng viên
                                        />
                                        <Trash
                                            className="cursor-pointer text-red-500 hover:text-red-700"
                                            size={20}
                                            onClick={() => handleDelete(item.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )
                    }
                </TableBody>
            </Table>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
                        <h2 className="text-lg font-semibold mb-4">Edit Applicant</h2>
                        <div className="mb-3">
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                type="text"
                                value={selectedApplicant.name}
                                onChange={(e) => setSelectedApplicant({ ...selectedApplicant, name: e.target.value })}
                                className="border p-2 w-full rounded-md"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={selectedApplicant.email}
                                onChange={(e) => setSelectedApplicant({ ...selectedApplicant, email: e.target.value })}
                                className="border p-2 w-full rounded-md"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium">Age</label>
                            <input
                                type="number"
                                value={selectedApplicant.age}
                                onChange={(e) => setSelectedApplicant({ ...selectedApplicant, age: e.target.value })}
                                className="border p-2 w-full rounded-md"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium">Gender</label>
                            <select
                                value={selectedApplicant.gender}
                                onChange={(e) => setSelectedApplicant({ ...selectedApplicant, gender: e.target.value })}
                                className="border p-2 w-full rounded-md"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
