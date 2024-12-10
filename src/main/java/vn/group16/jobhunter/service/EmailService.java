package vn.group16.jobhunter.service;

import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

@Service
public class EmailService {
    private final MailSender mailSender;
    private final J
    public EmailService(MailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail() {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo("vuquanghoanglam@gmail.com");
        msg.setSubject("Testing from Spring Boot");
        msg.setText("Hello World from Spring Boot Email");
        this.mailSender.send(msg);
    }
}
