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
        // String rootPath = servletContext.getRealPath("");
        String rootPath = Paths.get(uploadDir).toAbsolutePath().toString();
        String finalName = "";
        try {
            byte[] bytes = file.getBytes();

            File dir = new File(rootPath + File.separator + targetFolder);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            finalName = File.separator + System.currentTimeMillis() + file.getOriginalFilename();
            File serlverFile = new File(dir.getAbsolutePath() + finalName);

            BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serlverFile));
            stream.write(bytes);
            stream.close();

        } catch (IOException e) {
            // TODO: handle exception
            e.printStackTrace();
        }
        return finalName + rootPath;
    }
}
