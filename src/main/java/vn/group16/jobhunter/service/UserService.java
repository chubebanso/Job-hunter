package vn.group16.jobhunter.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.group16.jobhunter.domain.Meta;
import vn.group16.jobhunter.domain.ResultPaginationDTO;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.repository.UserRepository;

@Service
public class UserService {
    final private UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User handleCreateUser(User user) {
        return this.userRepository.save(user);
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

    public User handleUpdateUser(User user) {
        Optional<User> userUpdate = this.userRepository.findById(user.getId());
        if (userUpdate.isPresent()) {
            User currentUser = userUpdate.get();
            currentUser.setEmail(user.getEmail());
            currentUser.setName(user.getName());
            currentUser.setPassword(user.getPassword());
            return this.userRepository.save(currentUser);
        }
        return null;
    }

    public User getUserByUserName(String email) {
        return this.userRepository.findByEmail(email);
    }
}
