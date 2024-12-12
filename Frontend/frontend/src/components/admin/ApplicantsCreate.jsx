import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { setLoading } from '@/redux/authSlice'
import { USER_API_END_POINT } from '@/utils/constant'
import { Loader2 } from 'lucide-react'

const ApplicantsCreate = () => {
    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        roleName:""
    });

    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
    
        const data = {
            name: input.name,
            email: input.email,
            password: input.password,
            age: input.age,
            gender: input.gender,
            roleName: input.role,  // Gửi role từ state
        };
    
        const accessToken = localStorage.getItem("accessToken");
    
        try {
            dispatch(setLoading(true));
    
            const res = await axios.post(`${USER_API_END_POINT}/create`, data, {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${accessToken}`, // Gửi token trong header
                },
                withCredentials: true,
            });
    
            // Kiểm tra kết quả trả về từ API
            if (res.status === 201) {
                toast.success(res.data.message);
                // Giả sử bạn có thể lấy được ID từ response API hoặc từ state
                const applicantId = res.data?.applicantId;  // Giả sử bạn nhận được applicantId từ API
                navigate(`/admin/${applicantId}/applicants`);  // Chuyển hướng tới màn applicants của ứng viên
            } else {
                toast.error(res.data.message || "Something went wrong!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'An error occurred');
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>User Create</h1>
                    <p className='text-gray-500'>Create new user</p>
                </div>

                <Label>User Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="John Doe, Jane Smith etc."
                    name="name"
                    onChange={changeEventHandler}
                />

                <Label>Email</Label>
                <Input
                    type="email"
                    className="my-2"
                    placeholder="example@example.com"
                    name="email"
                    onChange={changeEventHandler}
                />

                <Label>Password</Label>
                <Input
                    type="password"
                    className="my-2"
                    placeholder="Enter password"
                    name="password"
                    onChange={changeEventHandler}
                />

                <Label>Age</Label>
                <Input
                    type="number"
                    className="my-2"
                    placeholder="Enter age"
                    name="age"
                    onChange={changeEventHandler}
                />

                <Label>Gender</Label>
                <div className="my-2">
                    <label>
                        <input
                            type="radio"
                            name="gender"
                            value="MALE"
                            onChange={() => setInput({ ...input, gender: 'MALE' })}
                        /> Male
                    </label>
                    <label className="ml-4">
                        <input
                            type="radio"
                            name="gender"
                            value="FEMALE"
                            onChange={() => setInput({ ...input, gender: 'FEMALE' })}
                        /> Female
                    </label>
                    <label className="ml-4">
                        <input
                            type="radio"
                            name="gender"
                            value="OTHER"
                            onChange={() => setInput({ ...input, gender: 'OTHER' })}
                        /> Other
                    </label>
                </div>

                {/* Thêm trường Role */}
                <Label>Role</Label>
                <div className="my-2">
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="HR"
                            checked={input.role === "HR"}
                            onChange={() => setInput({ ...input, role: 'HR' })}
                        /> HR
                    </label>
                    <label className="ml-4">
                        <input
                            type="radio"
                            name="role"
                            value="ADMIN"
                            checked={input.role === "ADMIN"}
                            onChange={() => setInput({ ...input, role: 'ADMIN' })}
                        /> Admin
                    </label>
                    <label className="ml-4">
                        <input
                            type="radio"
                            name="role"
                            value="USER"
                            checked={input.role === "USER"}
                            onChange={() => setInput({ ...input, role: 'USER' })}
                        /> User
                    </label>
                </div>

                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outlined" onClick={() => navigate("/admin/:id/applicants")}>Cancel</Button>
                    {
                        loading ? (
                            <Button className="w-full my-4" disabled>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" onClick={submitHandler} className="w-full my-4">
                                Continue
                            </Button>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default ApplicantsCreate;
