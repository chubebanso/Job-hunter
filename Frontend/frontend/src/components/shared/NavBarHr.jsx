import React from 'react';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react'; // Import LogOut icon
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner'; // Ensure toast is imported for notifications

const NavbarHr = () => {
    const navigate = useNavigate();

    // Fetch companyId from localStorage
    const companyId = localStorage.getItem('companyId');

    const logoutHandler = async () => {
        // Clear localStorage data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("companyId");

        // Navigate to login page
        navigate("/login");

        // Show success notification
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
                        {/* Jobs link */}
                        <li><Link to="/admin/jobs">Jobs</Link></li>

                        {/* CV link with dynamic companyId */}
                        {companyId ? (
                            <li><Link to={`/admin/companies/${companyId}/applicants`}>CV</Link></li>
                        ) : (
                            <li><span className="text-gray-400">CV (No Company ID)</span></li>
                        )}
                    </ul>

                    {/* Logout */}
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

export default NavbarHr;
