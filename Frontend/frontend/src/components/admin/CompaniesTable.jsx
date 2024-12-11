import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog';
import { Edit2, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompaniesTable = () => {
    const [filterCompany, setFilterCompany] = useState([]); // Dữ liệu danh sách công ty
    const [openDialog, setOpenDialog] = useState(false); // Trạng thái hiển thị hộp thoại
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [logo, setLogo] = useState(null); // Lưu trữ file logo
    const [website, setWebsite] = useState('');
    const navigate = useNavigate();

    // Lấy danh sách công ty
    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        const token = localStorage.getItem('accessToken'); // Lấy token từ local storage
        try {
            const response = await axios.get('http://localhost:8080/api/v1/companies', {
                headers: {
                    Authorization: `Bearer ${token}`, // Đính kèm token vào headers
                },
            });
            setFilterCompany(response.data); // Cập nhật danh sách công ty
        } catch (error) {
            console.error('Lỗi khi lấy danh sách công ty:', error);
        }
    };

    const handleLogoChange = (event) => {
        setLogo(event.target.files[0]); // Lưu tệp logo được chọn
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !description || !address || !logo || !website) {
            alert('Vui lòng điền đầy đủ các trường.');
            return;
        }

        try {
            const token = localStorage.getItem('accessToken'); // Lấy token từ local storage

            // Bước 1: Tải tệp logo lên
            const formData = new FormData();
            formData.append('imageFile', logo);
            const uploadResponse = await axios.post('http://localhost:8080/api/v1/upload?imageFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // Đính kèm token
                },
            });

            // Lấy tên file từ phản hồi API
            const uploadedLogoName = uploadResponse.data;

            if (!uploadedLogoName) {
                alert('Lỗi tải lên logo. Vui lòng thử lại.');
                return;
            }

            // Bước 2: Gửi yêu cầu tạo công ty với tên tệp logo
            const companyData = {
                name,
                description,
                address,
                logo: uploadedLogoName, // Gán tên file vào trường logo
                website,
            };

            const createResponse = await axios.post('http://localhost:8080/api/v1/companies/create', companyData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Đính kèm token
                },
            });

            console.log('Tạo công ty thành công:', createResponse.data);

            // Làm mới danh sách công ty
            fetchCompanies();

            // Đặt lại form sau khi gửi
            setName('');
            setDescription('');
            setAddress('');
            setLogo(null);
            setWebsite('');
            setOpenDialog(false); // Đóng hộp thoại
        } catch (error) {
            console.error('Lỗi khi tạo công ty:', error);
            alert('Tạo công ty thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div>
            {/* Phần tiêu đề */}
            <div className="flex justify-between items-center my-4">
                <h2 className="text-xl font-bold">Danh sách công ty</h2>
                {/* Hộp thoại thêm công ty mới */}
                <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
                    <DialogTrigger>
                        <Button variant="primary">Thêm công ty mới</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <div className="w-full max-w-md mx-auto">
                            <h2 className="text-xl font-bold mb-4">Tạo công ty mới</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Tên công ty"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <textarea
                                        placeholder="Mô tả"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Địa chỉ"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium">Logo</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="mt-1 w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Website"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>
                                <div className="flex justify-between mt-6">
                                    <Button type="submit" variant="primary">
                                        Tạo
                                    </Button>
                                    <Button onClick={() => setOpenDialog(false)} variant="outline">
                                        Hủy
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Bảng danh sách công ty */}
            <Table>
                <TableCaption>Danh sách công ty của bạn</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Tên</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany?.map((company) => (
                        <TableRow key={company.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={company.logo} />
                                </Avatar>
                            </TableCell>
                            <TableCell>{company.name}</TableCell>
                            <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div
                                            onClick={() => navigate(`/admin/companies/${company.id}`)}
                                            className="flex items-center gap-2 w-fit cursor-pointer"
                                        >
                                            <Edit2 className="w-4" />
                                            <span>Sửa</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default CompaniesTable;
