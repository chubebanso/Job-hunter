package vn.group16.jobhunter.service;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.ServletContext;

@Service
public class UploadService {
    @Value("${file.upload-dir}")
    private String uploadDir;

    private final ServletContext servletContext;

    public UploadService(ServletContext servletContext) {
        this.servletContext = servletContext;
    }

    public String handleSaveUploadFile(MultipartFile file, String targetFolder) {
        // Lấy đường dẫn tuyệt đối từ `uploadDir`
        String rootPath = Paths.get(uploadDir).toAbsolutePath().toString();
        String finalName = ""; // Chỉ lưu tên file

        try {
            // Đọc bytes từ file
            byte[] bytes = file.getBytes();

            // Tạo thư mục nếu chưa tồn tại
            File dir = new File(rootPath + File.separator + targetFolder);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Lấy tên file gốc
            finalName = file.getOriginalFilename();

            // Tạo file với đường dẫn đầy đủ
            File serverFile = new File(dir, finalName);

            // Ghi dữ liệu file vào hệ thống
            try (BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile))) {
                stream.write(bytes);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Chỉ trả về tên file
        return finalName;
    }

}
