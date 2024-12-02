package vn.group16.jobhunter.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    // @CrossOrigin
    @GetMapping("/")
    public String getHelloWorld() {
        return "Update";
    }
}
