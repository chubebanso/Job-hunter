import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Dialog, DialogTrigger, DialogContent } from '../ui/dialog';
import { Edit, Trash } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const CompaniesTable = () => {
    const [filterCompany, setFilterCompany] = useState([]); // Dữ liệu danh sách công ty
    const [openDialog, setOpenDialog] = useState(false); // Trạng thái hiển thị hộp thoại
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [logo, setLogo] = useState(null); // Lưu trữ file logo
    const [website, setWebsite] = useState('');
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");

    // Lấy danh sách công ty
    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/companies/all', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setFilterCompany(response.data.data); // Giả sử dữ liệu trong thuộc tính 'data'
        } catch (error) {
            console.error('Lỗi khi lấy danh sách công ty:', error);
            alert('Có lỗi xảy ra khi lấy danh sách công ty. Vui lòng thử lại sau.');
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
                    Authorization: `Bearer ${token}`,
                },
            });

            const uploadedLogoName = uploadResponse.data;
            if (!uploadedLogoName) {
                alert('Lỗi tải lên logo. Vui lòng thử lại.');
                return;
            }

            // Bước 2: Gửi yêu cầu tạo công ty
            const companyData = {
                name,
                description,
                address,
                logo: uploadedLogoName, // Gán tên file vào trường logo
                website,
            };

            const createResponse = await axios.post('http://localhost:8080/api/v1/companies/create', companyData, {
                headers: {
                    Authorization: `Bearer ${token}`,
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

    // Hàm xử lý xóa công ty
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8080/api/v1/companies/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (res.data="Delete Company Success") {
                // Cập nhật lại danh sách công ty sau khi xóa thành công
                setFilterCompany((prevCompanies) => prevCompanies.filter((company) => company.id !== id));
                toast.message('Công ty đã được xóa thành công!');
            } else {
                alert('Xóa công ty không thành công!');
            }
        } catch (error) {
            console.error('Lỗi khi xóa công ty:', error);
            alert('Có lỗi xảy ra khi xóa công ty. Vui lòng thử lại!');
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
                        <TableHead>Website</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
              <TableBody>
    {filterCompany?.map((company) => (
        <TableRow key={company.id}>
            <TableCell>
                {/* Sử dụng <img> để hiển thị ảnh trực tiếp */}
                <img
                    src={`/avatars/${company.logo}`}
                    alt={`Logo of ${company.name}`}
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} // Tuỳ chỉnh kích thước
                    // onError={(e) => {
                    //     e.target.src = '/assets/avatars/default-logo.png'; // Ảnh mặc định nếu không tìm thấy ảnh
                    // }}
                />
            </TableCell>
            <TableCell>{company.name}</TableCell>
            <TableCell>{company.createdAt.split('T')[0]}</TableCell>
            <TableCell>{company.website}</TableCell>
            <TableCell>{company.description}</TableCell>
            <TableCell>{company.address}</TableCell>
            <TableCell className="text-right cursor-pointer">
                <div className="flex gap-2 justify-end">
                    <Edit
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                        size={20}
                        onClick={() => navigate(`/edit-company/${company.id}`)} // Chuyển hướng tới trang chỉnh sửa công ty
                    />
                    <Trash
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        size={20}
                        onClick={() => handleDelete(company.id)} // Gọi hàm xóa khi click
                    />
                </div>
            </TableCell>
        </TableRow>
    ))}
</TableBody>

            </Table>
        </div>
    );
};

export default CompaniesTable;
