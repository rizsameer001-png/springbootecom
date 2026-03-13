package com.zulugshop.controller;

import com.zulugshop.exception.BadRequestException;
import com.zulugshop.exception.ResourceNotFoundException;
import com.zulugshop.model.Product;
import com.zulugshop.model.Review;
import com.zulugshop.model.User;
import com.zulugshop.repository.ProductRepository;
import com.zulugshop.repository.ReviewRepository;
import com.zulugshop.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@PathVariable String productId) {
        return ResponseEntity.ok(reviewRepository.findByProductIdOrderByCreatedAtDesc(productId));
    }

    @PostMapping
    public ResponseEntity<Review> addReview(
            @PathVariable String productId,
            @Valid @RequestBody ReviewRequest req,
            Authentication auth
    ) {
        if (reviewRepository.existsByProductIdAndUserId(productId, getUserId(auth))) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Review review = Review.builder()
                .productId(productId)
                .userId(user.getId())
                .userName(user.getFirstName() + " " + user.getLastName())
                .userAvatar(user.getAvatar())
                .rating(req.getRating())
                .title(req.getTitle())
                .comment(req.getComment())
                .build();

        review = reviewRepository.save(review);

        // Recalculate product rating
        List<Review> allReviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        double avgRating = allReviews.stream().mapToInt(Review::getRating).average().orElse(0);
        product.setRating(Math.round(avgRating * 10.0) / 10.0);
        product.setReviewCount(allReviews.size());
        productRepository.save(product);

        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String productId,
            @PathVariable String reviewId,
            Authentication auth
    ) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", reviewId));

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        boolean isOwner = review.getUserId().equals(user.getId());
        boolean isAdmin = user.getRoles().contains("ROLE_ADMIN");

        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        reviewRepository.delete(review);
        return ResponseEntity.noContent().build();
    }

    private String getUserId(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .map(User::getId).orElse("");
    }

    @Data
    public static class ReviewRequest {
        @Min(1) @Max(5)
        private int rating;
        @NotBlank
        private String title;
        @NotBlank
        private String comment;
    }
}
