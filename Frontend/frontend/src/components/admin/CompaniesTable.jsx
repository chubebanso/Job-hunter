import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Trash } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
  const navigate = useNavigate();
  
  // Hàm xử lý sự kiện xóa công ty
  const handleDelete = (companyId) => {
    // Xử lý xóa công ty, ví dụ gọi API hoặc dispatch action trong Redux
    console.log('Xóa công ty có ID: ', companyId);
  };

  return (
    <div>
      <Table>
        <TableCaption>List công ty</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <Avatar>
                <AvatarImage src='' />
              </Avatar>
            </TableCell>
            <TableCell>name</TableCell>
            <TableCell>ngay</TableCell>
            <TableCell className="text-right cursor-pointer">
              <Popover>
                <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                <PopoverContent className="w-32">
                  <div className='flex items-center gap-2 w-fit cursor-pointer'>
                    <Edit2 className='w-4' />
                    <span>Edit</span>
                  </div>
                  {/* Thêm nút Delete */}
                  <div
                    className='flex items-center gap-2 w-fit cursor-pointer text-red-600'
                    onClick={() => handleDelete('company-id')}
                  >
                    <Trash className='w-4' />
                    <span>Delete</span>
                  </div>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
