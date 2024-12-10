package vn.group16.jobhunter.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.group16.jobhunter.domain.Subscriber;
import vn.group16.jobhunter.service.SubscriberService;
import vn.group16.jobhunter.util.error.EmailInvalidException;

@RestController
@RequestMapping("/api/v1")
public class SubscriberController {
    final private SubscriberService subscriberService;

    public SubscriberController(SubscriberService subscriberService) {
        this.subscriberService = subscriberService;
    }

    @PostMapping("/create/subscribers")
    public ResponseEntity<Subscriber> createSubscriber(@RequestBody Subscriber subscriber)
            throws EmailInvalidException {
        if (this.subscriberService.getSubscriberByEmail(subscriber.getEmail()) != null) {
            throw new EmailInvalidException("Email bi trung.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.subscriberService.creatSubscriber(subscriber));
    }
}
