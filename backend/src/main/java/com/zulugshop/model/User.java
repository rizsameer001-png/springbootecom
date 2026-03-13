package com.zulugshop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String firstName;
    private String lastName;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String phone;
    private String avatar;

    @Builder.Default
    private Set<String> roles = new HashSet<>(Set.of("ROLE_USER"));

    @Builder.Default
    private boolean active = true;

    private Address defaultAddress;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Address {
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;
    }
	
//	public String getId() {
//	    return id;
//	}
//
//	public String getEmail() {
//	    return email;
//	}
//
//	public String getFirstName() {
//	    return firstName;
//	}
//
//	public String getLastName() {
//	    return lastName;
//	}
//
//	public String getAvatar() {
//	    return avatar;
//	}
//
//	public Set<String> getRoles() {
//	    return roles;
//	}
}
