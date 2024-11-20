package vn.group16.jobhunter.controller;

import org.springframework.web.bind.annotation.RestController;

import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.service.UserService;
import vn.group16.jobhunter.util.annotation.APIMessage;
import vn.group16.jobhunter.util.error.IdInvalidException;

import java.util.List;

import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/v1")
public class UserController {
    final private UserService userService;
    final private PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody User postmanUser) {
        String hashPassword = this.passwordEncoder.encode(postmanUser.getPassword());
        postmanUser.setPassword(hashPassword);
        User user = this.userService.handleCreateUser(postmanUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable("id") long id) throws IdInvalidException {
        if (id > 1500) {
            throw new IdInvalidException("Khong tim thay user");
        }
        this.userService.handleDeteteUser(id);
        return ResponseEntity.ok("user");
    }

    @GetMapping("/users/{user_id}")
    public ResponseEntity<User> getUserById(@PathVariable("user_id") long user_id) {
        User user = this.userService.getUserById(user_id);

        return ResponseEntity.ok(user);
    }

    @GetMapping("/users/all")
    @APIMessage("get all user")
    public ResponseEntity<ResultPaginationDTO> getAllUser(Pageable pageable,
            @Filter Specification<User> spec) {
        return ResponseEntity.status(HttpStatus.OK).body(this.userService.getAllUser(spec, pageable));
    }

    @PutMapping("/users/update")
    public ResponseEntity<User> updateUser(@RequestBody User userUpdate) {
        return ResponseEntity.ok(this.userService.handleUpdateUser(userUpdate));
    }

}
