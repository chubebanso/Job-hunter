import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User2, LogOut } from 'lucide-react'

const Navbar = () => {
    const user = false;
    return (
        <div className="bg-white">
            <div className='flex items-start justify-between mx-auto max-w-7xl h-16'>
                <div>
                    <h1 className="text-2xl font-bold">Job<span className="text-[#F83002]">Portal</span></h1>
                </div>

                <div className='flex items-center gap-2'>
                    <ul className="flex font-medium items-start gap-5">
                        <li>Home</li>
                        <li>Jobs</li>
                        <li>Browse</li>
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to = "/login" ><Button variant="outline">Login</Button></Link>
                               <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Sign up</Button></Link>
                                
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className=''>
                                        <div className='flex gap-2 space-y-2'>
                                            <Avatar className="cursor-pointer">
                                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium'>Patel Mernstack</h4>
                                                <p className='text-sm text-muted-foreground'> Xin chào</p>
                                            </div>
                                        </div>
                                        <div className='flex col gap-3 my-2 text-gray-600'>

                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <User2 />
                                                <Button variant="link">View Profile</Button>
                                            </div>
                                            <div className='flex w-fit items-center gap-2 cursor-pointer'>
                                                <LogOut />

                                                <Button variant="link">Logout</Button>
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
