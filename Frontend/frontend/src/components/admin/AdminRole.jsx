import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ROLE_API = 'http://localhost:8080/api/v1'; // Cập nhật URL API backend

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);  // Danh sách các role
    const [input, setInput] = useState({ name: '' });  // Dữ liệu nhập cho role mới
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch danh sách role từ backend
    useEffect(() => {
        fetchRoles();
    }, []);

    // Fetch danh sách các role từ API backend
    const fetchRoles = async () => {
        try {
            const res = await axios.get(`${ROLE_API}`);  // Cập nhật URL backend
            setRoles(res.data);  // Lưu dữ liệu các role vào state
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch roles.');
        }
    };

    // Xử lý thay đổi input khi người dùng nhập
    const handleInputChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // Xử lý tạo role mới
    const createRole = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            // Gửi dữ liệu đến backend để tạo role mới
            const res = await axios.post(`${ROLE_API}`, { name: input.name });
            toast.success('Role created successfully');
            setInput({ name: '' });  // Reset input
            fetchRoles();  // Fetch lại danh sách role
        } catch (error) {
            console.error(error);
            toast.error('Failed to create role');
        } finally {
            setLoading(false);
        }
    };

    // Xử lý gán role cho user (chưa có trong mã hiện tại, nhưng có thể bổ sung sau)
    //const handleAssignRoleToUser = async (userId, roleId) => {
        //try {
            //const res = await axios.put(`/api/users/${userId}/roles`, { roleId });
            //toast.success('Role assigned to user successfully');
        //} catch (error) {
            //console.error(error);
            //toast.error('Failed to assign role');
        //}
    //}

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <div className="flex items-center gap-5 p-8">
                    <Button onClick={() => navigate("/admin/dashboard")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                        <ArrowLeft />
                        <span>Back</span>
                    </Button>
                    <h1 className='font-bold text-xl'>Role Management</h1>
                </div>

                {/* Form để tạo role mới */}
                <form onSubmit={createRole}>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Role Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">Create Role</Button>
                    )}
                </form>

                {/* Hiển thị các role đã tạo */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">Existing Roles</h2>
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="border p-2">Role Name</th>
                                <th className="border p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map(role => (
                                <tr key={role.id}> {/* Đảm bảo id của role là duy nhất */}
                                    <td className="border p-2">{role.name}</td>
                                    <td className="border p-2">
                                        <Button onClick={() => navigate(`/admin/roles/${role.id}/users`)} className="mr-2">Assign</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RoleManagement;
