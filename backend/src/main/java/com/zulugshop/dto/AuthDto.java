package com.zulugshop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDto {

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "First name is required")
        private String firstName;

        @NotBlank(message = "Last name is required")
        private String lastName;

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;

        private String phone;
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String refreshToken;
        private String id;
        private String email;
        private String firstName;
        private String lastName;
        private String avatar;
        private java.util.Set<String> roles;

        public AuthResponse(String token, String refreshToken, com.zulugshop.model.User user) {
            this.token = token;
            this.refreshToken = refreshToken;
            this.id = user.getId();
            this.email = user.getEmail();
            this.firstName = user.getFirstName();
            this.lastName = user.getLastName();
            this.avatar = user.getAvatar();
            this.roles = user.getRoles();
        }
    }

    @Data
    public static class RefreshRequest {
        @NotBlank
        private String refreshToken;
    }
}
