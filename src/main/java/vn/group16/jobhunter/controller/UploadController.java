package vn.group16.jobhunter.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import vn.group16.jobhunter.service.UploadService;

@RestController
@RequestMapping("/api/v1")
public class UploadController {
    final private UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("imageFile") MultipartFile imageFile) {
        String avatar = "";
        avatar = this.uploadService.handleSaveUploadFile(imageFile, "avatars");
        System.out.println(avatar);
        return ResponseEntity.ok(avatar);
    }
}
