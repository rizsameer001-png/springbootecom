package com.zulugshop.controller;

import com.zulugshop.exception.ResourceNotFoundException;
import com.zulugshop.model.User;
import com.zulugshop.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setPassword(null); // never expose password
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestBody UpdateProfileRequest req,
            Authentication auth
    ) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (req.getFirstName() != null) user.setFirstName(req.getFirstName());
        if (req.getLastName()  != null) user.setLastName(req.getLastName());
        if (req.getPhone()     != null) user.setPhone(req.getPhone());
        if (req.getAvatar()    != null) user.setAvatar(req.getAvatar());

        if (req.getAddress() != null) {
            user.setDefaultAddress(User.Address.builder()
                    .street(req.getAddress().getStreet())
                    .city(req.getAddress().getCity())
                    .state(req.getAddress().getState())
                    .zipCode(req.getAddress().getZipCode())
                    .country(req.getAddress().getCountry())
                    .build());
        }

        user = userRepository.save(user);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordRequest req,
            Authentication auth
    ) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().build();
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    @Data
    public static class UpdateProfileRequest {
        private String firstName;
        private String lastName;
        private String phone;
        private String avatar;
        private AddressReq address;
    }

    @Data
    public static class AddressReq {
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;
    }

    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }
}
