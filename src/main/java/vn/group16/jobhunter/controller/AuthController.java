package vn.group16.jobhunter.controller;
 
import java.net.http.HttpHeaders;
 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.resource.OAuth2ResourceServerProperties.Jwt;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import jakarta.validation.Valid;
import vn.group16.jobhunter.domain.Role;
import vn.group16.jobhunter.domain.User;
import vn.group16.jobhunter.dto.LoginDTO;
import vn.group16.jobhunter.dto.ResLoginDTO;
import vn.group16.jobhunter.service.RoleService;
import vn.group16.jobhunter.service.UserService;
import vn.group16.jobhunter.util.SecurityUtil;
import vn.group16.jobhunter.util.annotation.APIMessage;
import vn.group16.jobhunter.util.error.IdInvalidException;
 
@RestController
@RequestMapping("/api/v1")
public class AuthController {
        private final AuthenticationManagerBuilder authenticationManagerBuilder;
        private final SecurityUtil securityUtil;
        private final UserService userService;
 
        public AuthController(AuthenticationManagerBuilder authenticationManagerBuilder, SecurityUtil securityUtil,
                        UserService userService) {
                this.authenticationManagerBuilder = authenticationManagerBuilder;
                this.securityUtil = securityUtil;
                this.userService = userService;
        }
 
        @PostMapping("/login")
        public ResponseEntity<Object> login(@Valid @RequestBody LoginDTO loginDto) {
                // Nạp input gồm username/password vào Security
                UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                loginDto.getEmail(), loginDto.getPassword());
 
                // xác thực người dùng => cần viết hàm loadUserByUsername
                Authentication authentication = authenticationManagerBuilder.getObject()
                                .authenticate(authenticationToken);
 
                // nạp thông tin (nếu xử lý thành công) vào SecurityContext
                // create token
                SecurityContextHolder.getContext().setAuthentication(authentication);
                ResLoginDTO res = new ResLoginDTO();
                User currentUser = this.userService.getUserByEmail(loginDto.getEmail());
                Role role = currentUser.getRole();
                if (currentUser != null) {
                        ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin(currentUser.getId(),
                                        currentUser.getEmail(),
                                        currentUser.getName());
                        res.setRole(role);
                        res.setUserLogin(userLogin);
                }
                String access_token = this.securityUtil.createToken(authentication.getName(), res.getUserLogin());
                res.setAccessToken(access_token);
                return ResponseEntity.ok()
                                .body(res);
        }
 
        @GetMapping("/auth/account")
        @APIMessage("/fetch account")
        ResponseEntity<ResLoginDTO.UserLogin> getAccount() {
                String email = SecurityUtil.getCurrentUserLogin().isPresent() ? SecurityUtil.getCurrentUserLogin().get()
                                : "";
                User currentUser = this.userService.getUserByEmail(email);
                ResLoginDTO.UserLogin userLogin = new ResLoginDTO.UserLogin();
                if (currentUser != null) {
                        userLogin.setId(currentUser.getId());
                        userLogin.setEmail(currentUser.getEmail());
                        userLogin.setName(currentUser.getName());
                }
                return ResponseEntity.ok(userLogin);
        }
 
}