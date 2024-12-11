package vn.group16.jobhunter.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Company;
import vn.group16.jobhunter.domain.Job;
import vn.group16.jobhunter.domain.Meta;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.domain.Role;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.dto.CreateUserDTO;
import vn.group16.jobhunter.repository.JobRepository;
import vn.group16.jobhunter.repository.RoleRepository;
import vn.group16.jobhunter.repository.UserRepository;

@Service
public class UserService {
    final private UserRepository userRepository;
    final private RoleRepository roleRepository;

    public UserService(
        UserRepository userRepository, 
        RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    public User handleCreateUser(CreateUserDTO postmanUser) {
        Role userRole = this.roleRepository.findByName(postmanUser.getRoleName());
        if (userRole != null) {
            User user = new User();
            user.setName(postmanUser.getName());
            user.setEmail(postmanUser.getEmail());
            user.setAge(postmanUser.getAge());
            user.setGender(postmanUser.getGender());
            user.setPassword(postmanUser.getPassword());
            user.setRole(userRole);
            return this.userRepository.save(user);
        }
        return null;
    }

    public void handleDeteteUser(long id) {
        this.userRepository.deleteById(id);
    }

    public User getUserById(long id) {
        Optional<User> userOptional = this.userRepository.findById(id);
        if (userOptional.isPresent()) {
            return userOptional.get();
        }
        return null;
    }

    public ResultPaginationDTO getAllUser(Specification<User> spec, Pageable pageable) {
        Page<User> pageUser = this.userRepository.findAll(pageable);
        ResultPaginationDTO res = new ResultPaginationDTO();
        Meta mt = new Meta();
        mt.setPage(pageUser.getNumber() + 1);
        mt.setPageSize(pageUser.getSize());
        mt.setPages(pageUser.getTotalPages());
        mt.setTotal(pageUser.getTotalElements());
        res.setMeta(mt);
        res.setResult(pageUser.getContent());
        return res;
    }

    public User handleUpdateUser(User user, long user_id) {
        Optional<User> userUpdate = this.userRepository.findById(user_id);
        if (userUpdate.isPresent()) {
            User currentUser = userUpdate.get();
            currentUser.setEmail(user.getEmail());
            currentUser.setName(user.getName());
            currentUser.setAge(user.getAge());
            currentUser.setGender(user.getGender());
            return this.userRepository.save(currentUser);
        }
        return null;
    }

    public User getUserByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public void updateToken(String refreshToken, String email) {
        User currentUser = this.userRepository.findByEmail(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(refreshToken);
            this.userRepository.save(currentUser);
        }
    }

    public User getUserByRefreshTokenAndEmail(String email, String token) {
        return this.userRepository.findByEmailAndRefreshToken(email, token);
    }

    public User applyUserToJob(User user, Job job){
        user.getJobs().add(job);
        job.getApplicants().add(user);
        return this.userRepository.save(user);
    }

    public User unapplyUserToJob(User user, Job job){
        user.getJobs().remove(job);
        job.getApplicants().remove(user);
        return this.userRepository.save(user);
    }

    //////////////////////////////////////////////// 2024/12/11
    
    public User userAddAccepted(User user, Job job){
        user.getAcceptedJobs().add(job);
        job.getAcceptedApplicants().add(user);
        return this.userRepository.save(user);
    }

    public User userRemoveAccepted(User user, Job job){
        user.getAcceptedJobs().remove(job);
        job.getAcceptedApplicants().remove(user);
        return this.userRepository.save(user);
    }

    public User userAddRejected(User user, Job job){
        user.getRejectedJobs().add(job);
        job.getRejectedApplicants().add(user);
        return this.userRepository.save(user);
    }

    public User userRemoveRejected(User user, Job job){
        user.getRejectedJobs().remove(job);
        job.getRejectedApplicants().remove(user);
        return this.userRepository.save(user);
    }

    ////////////////////////////////////////////////

    public User addUserToCompany(User user, Company company){
        user.setCompany(company);
        company.getUsers().add(user);
        return this.userRepository.save(user);
    }

    public User removeUserFromCompany(User user, Company company){
        user.setCompany(null);
        company.getUsers().remove(user);
        return this.userRepository.save(user);
    }
}
