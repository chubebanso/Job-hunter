package vn.group16.jobhunter.dto;

import vn.group16.jobhunter.domain.Role;

public class ResLoginDTO {
    private String accessToken;
    private UserLogin userLogin;
    Role role;

    public static class UserLogin {
        private long id;
        private String email;
        private String name;

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public UserLogin(long id, String email, String name) {
            this.id = id;
            this.email = email;
            this.name = name;
        }

        public UserLogin() {

        }

    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public UserLogin getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(UserLogin userLogin) {
        this.userLogin = userLogin;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

}
