package vn.group16.jobhunter.controller;

import org.springframework.web.bind.annotation.RestController;

import vn.group16.jobhunter.domain.Company;
import vn.group16.jobhunter.domain.Job;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.dto.CreateUserDTO;
import vn.group16.jobhunter.service.CompanyService;
import vn.group16.jobhunter.service.JobService;
import vn.group16.jobhunter.service.UserService;
import vn.group16.jobhunter.util.annotation.APIMessage;
import vn.group16.jobhunter.util.error.EmailInvalidException;
import vn.group16.jobhunter.util.error.IdInvalidException;

import java.util.List;
import java.util.Optional;

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
    final private JobService jobService;
    final private CompanyService companyService;
    final private PasswordEncoder passwordEncoder;

    public UserController(
        UserService userService,
        JobService jobService, 
        CompanyService companyService,
        PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.jobService = jobService;
        this.companyService = companyService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users/create")
    public ResponseEntity<User> createUser(@RequestBody CreateUserDTO postmanUser) throws EmailInvalidException {
        String hashPassword = this.passwordEncoder.encode(postmanUser.getPassword());
        postmanUser.setPassword(hashPassword);
        if (this.userService.getUserByEmail(postmanUser.getEmail()) != null) {
            throw new EmailInvalidException("Email bi trung.");
        }
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

    @PutMapping("/users/{user_id}/add/jobs/{job_id}")
    public ResponseEntity<User> applyUser(
        @PathVariable("user_id") long user_id,
        @PathVariable("job_id") long job_id
    ) throws IdInvalidException{
        User tempUser = this.userService.getUserById(user_id);
        Job tempJob = this.jobService.getJobById(job_id);
        if(tempUser == null || tempJob == null) throw new IdInvalidException("Cannot find user/job.");
        else return ResponseEntity.ok(this.userService.applyUserToJob(tempUser, tempJob));
    }

    @PutMapping("/users/{user_id}/remove/jobs/{job_id}")
    public ResponseEntity<User> unapplyUser(
        @PathVariable("user_id") long user_id,
        @PathVariable("job_id") long job_id
    ) throws IdInvalidException{
        User tempUser = this.userService.getUserById(user_id);
        Job tempJob = this.jobService.getJobById(job_id);
        if(tempUser == null || tempJob == null) throw new IdInvalidException("Cannot find user/job.");
        else return ResponseEntity.ok(this.userService.unapplyUserToJob(tempUser, tempJob));
    }

    //////////////////////////////////////////////// 2024/12/11
    @PutMapping("/users/{user_id}/add/jobs/{job_id}/accepted")
    public ResponseEntity<User> userAddAccepted(
        @PathVariable("user_id") long user_id,
        @PathVariable("job_id") long job_id
    ) throws IdInvalidException{
        User tempUser = this.userService.getUserById(user_id);
        Job tempJob = this.jobService.getJobById(job_id);
        return ResponseEntity.ok(this.userService.userAddAccepted(tempUser, tempJob));
    }

    @PutMapping("/users/{user_id}/remove/jobs/{job_id}/accepted")
    public ResponseEntity<User> userRemoveAccepted(
        @PathVariable("user_id") long user_id,
        @PathVariable("job_id") long job_id
    ) throws IdInvalidException{
        User tempUser = this.userService.getUserById(user_id);
        Job tempJob = this.jobService.getJobById(job_id);
        return ResponseEntity.ok(this.userService.userRemoveAccepted(tempUser, tempJob));
    }

    @PutMapping("/users/{user_id}/add/jobs/{job_id}/accepted")
    public ResponseEntity<User> userAddRejected(
        @PathVariable("user_id") long user_id,
        @PathVariable("job_id") long job_id
    ) throws IdInvalidException{
        User tempUser = this.userService.getUserById(user_id);
        Job tempJob = this.jobService.getJobById(job_id);
        return ResponseEntity.ok(this.userService.userAddRejected(tempUser, tempJob));
    }

    @PutMapping("/users/{user_id}/add/jobs/{job_id}/accepted")
    public ResponseEntity<User> userRemoveRejected(
        @PathVariable("user_id") long user_id,
        @PathVariable("job_id") long job_id
    ) throws IdInvalidException{
        User tempUser = this.userService.getUserById(user_id);
        Job tempJob = this.jobService.getJobById(job_id);
        return ResponseEntity.ok(this.userService.userRemoveRejected(tempUser, tempJob));
    }

    ////////////////////////////////////////////////

    @PutMapping("/users/{user_id}/add/companies/{company_id}")
    public ResponseEntity<User> addUserToCompany(
        @PathVariable("user_id") long user_id,
        @PathVariable("company_id") long company_id
    ) throws IdInvalidException{
        User tempUser = this.userService.getUserById(user_id);
        Company tempCompany = this.companyService.getCompanyById(company_id);
        if(tempUser == null || tempCompany == null) throw new IdInvalidException("Cannot find user/job.");
        else return ResponseEntity.ok(this.userService.addUserToCompany(tempUser, tempCompany));
    }
    
    @PutMapping("/users/{user_id}/remove/companies/{company_id}")
    public ResponseEntity<User> removeUserFromCompany(
        @PathVariable("user_id") long user_id,
        @PathVariable("company_id") long company_id
    ) throws IdInvalidException{
        User tempUser = this.userService.getUserById(user_id);
        Company tempCompany = this.companyService.getCompanyById(company_id);
        if(tempUser == null || tempCompany == null) throw new IdInvalidException("Cannot find user/job.");
        else return ResponseEntity.ok(this.userService.removeUserFromCompany(tempUser, tempCompany));
    }
}
