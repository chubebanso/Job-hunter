import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage } from '../ui/avatar';
import { LogOut, User2, Settings } from 'lucide-react'; // Import Settings icon
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { AUTH_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const [userInfo, setUserInfo] = useState(null); // State lưu thông tin người dùng
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken"); // Lấy accessToken từ localStorage

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUserInfo(JSON.parse(userData)); // Parse JSON string thành object
        }
    }, []);

    const logoutHandler = async () => {
                localStorage.removeItem("accessToken"); // Xóa token khi logout
                localStorage.removeItem("user"); // Xóa thông tin user khi logout
                dispatch(setUser(null));
                navigate("/");
                toast.success("Log out successfull");
    };

    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className='text-2xl font-bold'>JobPortal<span className='text-[#F83002]'> Group16</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        <li><Link to="/">Home</Link></li>
                    </ul>
                    {
                        !accessToken ? ( // Kiểm tra nếu không có accessToken
                            <div className='flex items-center gap-2'>
                                <Link to="/login"><Button variant="outline">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button></Link>
                            </div>
                        ) : ( // Nếu có accessToken
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" className="p-2">
                                        <Settings size={20} className="text-gray-700" /> {/* Icon Settings */}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div>
                                        {/* User Info */}
                                        <div className='flex gap-2 mb-4'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage alt={userInfo?.name || "User"} />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>{userInfo?.name || "Guest"}</h4>
                                                <p className='text-sm text-muted-foreground'>{userInfo?.email || "No email"}</p>
                                            </div>
                                        </div>
                                        {/* Menu Items */}
                                        <div className='flex flex-col my-2 text-gray-600'>
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <User2 size={18} />
                                                <Button variant="link"><Link to="/profile">View Profile</Link></Button>
                                            </div>
                                            <div className='flex w-fit items-center gap-2 cursor-pointer mt-2'>
                                                <LogOut size={18} />
                                                <Button onClick={logoutHandler} variant="link">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;
