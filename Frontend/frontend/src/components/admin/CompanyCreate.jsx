import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { ArrowLeft, Loader2 } from 'lucide-react';

const CompanyCreate = () => {
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        address: "",  
        file: null
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    // Handle form submission
    const submitHandler = async (e) => {
        e.preventDefault();
    
        const data = {
            name: input.name,
            description: input.description,
            website: input.website,
            address: input.address  
        };
        if (input.file) {
            data.file = input.file; 
        }
    
        try {
            dispatch(setLoading(true));
    
            const res = await axios.post(`${COMPANY_API_END_POINT}/create`, data, {
                headers: {
                    'Content-Type': "application/json"
                },
                withCredentials: true
            });

            if (res.status === 201) {
                toast.success(res.data.message);
                const companyId = res.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
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
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={submitHandler}>
                    <div className='flex items-center gap-5 p-8'>
                        <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Address</Label>  
                            <Input
                                type="text"
                                name="address"  
                                value={input.address}  
                                onChange={changeEventHandler}
                            />
                        </div>
                        <div>
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                            />
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Continue</Button>
                    }
                </form>
            </div>

        </div>
    );
};

export default CompanyCreate;
