package com.zulugshop.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;

    private String productId;
    private String userId;
    private String userName;
    private String userAvatar;
    private int rating;
    private String title;
    private String comment;
    private boolean verified;

    @CreatedDate
    private LocalDateTime createdAt;
}
