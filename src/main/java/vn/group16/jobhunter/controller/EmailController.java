package vn.group16.jobhunter.controller;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.group16.jobhunter.service.EmailService;
import vn.group16.jobhunter.service.SubscriberService;

@RestController
@RequestMapping("/api/v1")
public class EmailController {
    private final EmailService emailSerivce;
    private final SubscriberService subscriberService;

    public EmailController(EmailService emailSerivce, SubscriberService subscriberService) {
        this.emailSerivce = emailSerivce;
        this.subscriberService = subscriberService;
    }

    @GetMapping("/email")
    @Scheduled(cron = "*/6000 * * * * *")
    public String sendEmail() {
        this.subscriberService.sendSubscribersEmailJobs();
        ;
        return "OK";
    }
}
