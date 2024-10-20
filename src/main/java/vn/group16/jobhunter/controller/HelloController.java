package vn.group16.jobhunter.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.group16.jobhunter.util.error.IdInvalidException;

@RestController
public class HelloController {
    // @CrossOrigin
    @GetMapping("/")
    public String getHelloWorld() {
        return "Update";
    }
}
