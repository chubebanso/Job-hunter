package vn.group16.jobhunter.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.group16.jobhunter.service.EmailService;

@RestController
@RequestMapping("/api/v1")
public class EmailController {
    private final EmailService emailSerivce;

    public EmailController(EmailService emailSerivce) {
        this.emailSerivce = emailSerivce;
    }

    @GetMapping("/email")
    public String sendEmail() {
        this.emailSerivce.sendEmail();
        return "OK";
    }
}
