import React from 'react';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react'; // Import LogOut icon
import { Link , useNavigate} from 'react-router-dom';

const NavbarAdmin = () => {
 const navigate = useNavigate(); 
  const logoutHandler = async () => {
        // Xóa sạch thông tin trong localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        // Chuyển hướng về trang login
        navigate("/login");

        // Hiển thị thông báo thành công
        toast.success("Log out successful");
    };

    return (
        <div className='bg-white'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className='text-2xl font-bold'>JobPortal<span className='text-[#F83002]'> Group16</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {/* Remove Home button and add Companies and Applicants */}
                        <li><Link to="/admin/companies">Companies</Link></li>
                        <li><Link to="/admin/companies/:id/applicants">Applicants</Link></li>
                    </ul>

                    {/* Menu Items */}
                    <div className='flex flex-col my-2 text-gray-600'>
                        <div className='flex w-fit items-center gap-2 cursor-pointer mt-2'>
                            <LogOut size={18} />
                            <Button onClick={logoutHandler} variant="link">Logout</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavbarAdmin;
